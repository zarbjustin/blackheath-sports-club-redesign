import { errorResponse } from "./responses.js";

let cachedKeys;
let cachedAt = 0;
const KEY_CACHE_MS = 60 * 60 * 1000;

function decodeBase64Url(value) {
  const normalised = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalised.padEnd(Math.ceil(normalised.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function decodeJson(value) {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value)));
}

async function getSigningKeys(issuer) {
  if (cachedKeys && Date.now() - cachedAt < KEY_CACHE_MS) return cachedKeys;

  const response = await fetch(`${issuer}/cdn-cgi/access/certs`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("Unable to retrieve Access signing keys.");

  const body = await response.json();
  cachedKeys = body.keys || body.public_certs || [];
  cachedAt = Date.now();
  return cachedKeys;
}

function audienceMatches(claim, expected) {
  return Array.isArray(claim) ? claim.includes(expected) : claim === expected;
}

export async function verifyAccessRequest(request, env) {
  const requestUrl = new URL(request.url);
  const localBypass =
    env.ALLOW_LOCAL_ADMIN === "true" &&
    ["localhost", "127.0.0.1"].includes(requestUrl.hostname);

  if (localBypass) return { email: "local-admin@blackheathsportsclub.co.uk" };

  if (!env.ACCESS_ISSUER || !env.ACCESS_AUD) {
    throw new Error("Administrator authentication is not configured.");
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = decodeJson(encodedHeader);
  const payload = decodeJson(encodedPayload);
  if (header.alg !== "RS256" || !header.kid) return null;

  const keys = await getSigningKeys(env.ACCESS_ISSUER.replace(/\/$/, ""));
  const jwk = keys.find((key) => key.kid === header.kid);
  if (!jwk) return null;

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const validSignature = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    decodeBase64Url(encodedSignature),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
  );

  const now = Math.floor(Date.now() / 1000);
  const expectedIssuer = env.ACCESS_ISSUER.replace(/\/$/, "");
  if (
    !validSignature ||
    payload.iss?.replace(/\/$/, "") !== expectedIssuer ||
    !audienceMatches(payload.aud, env.ACCESS_AUD) ||
    typeof payload.exp !== "number" ||
    payload.exp <= now ||
    (typeof payload.nbf === "number" && payload.nbf > now)
  ) {
    return null;
  }

  return { email: payload.email || payload.sub || "authenticated-admin" };
}

export async function requireAccess(context) {
  try {
    const identity = await verifyAccessRequest(context.request, context.env);
    if (!identity) {
      return { response: errorResponse(401, "Administrator sign-in is required.") };
    }
    return { identity };
  } catch (error) {
    return {
      response: errorResponse(
        503,
        error instanceof Error ? error.message : "Administrator authentication is unavailable.",
      ),
    };
  }
}

export function hasSameOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return false;
  return origin === new URL(request.url).origin;
}
