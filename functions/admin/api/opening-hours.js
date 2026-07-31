import { hasSameOrigin, requireAccess } from "../../lib/access.js";
import {
  publicOpeningHours,
  readOpeningHours,
  readRecentHistory,
  saveOpeningHours,
} from "../../lib/opening-hours-store.js";
import { errorResponse, json } from "../../lib/responses.js";

function noStore(data, init = {}) {
  return json(data, {
    ...init,
    headers: { "Cache-Control": "no-store", ...(init.headers || {}) },
  });
}

async function adminContext(context) {
  const auth = await requireAccess(context);
  if (auth.response) return auth;
  if (!context.env.OPENING_HOURS_DB) {
    return { response: errorResponse(503, "The opening-hours database is not configured.") };
  }
  return auth;
}

export async function onRequestGet(context) {
  const auth = await adminContext(context);
  if (auth.response) return auth.response;

  try {
    const [record, history] = await Promise.all([
      readOpeningHours(context.env.OPENING_HOURS_DB),
      readRecentHistory(context.env.OPENING_HOURS_DB),
    ]);
    return noStore({
      ok: true,
      config: record.config,
      revision: record.revision,
      updatedAt: record.updatedAt,
      updatedBy: record.updatedBy,
      publicHours: publicOpeningHours(record),
      history,
      administrator: auth.identity.email,
    });
  } catch {
    return errorResponse(503, "Opening hours could not be loaded.");
  }
}

export async function onRequestPut(context) {
  const auth = await adminContext(context);
  if (auth.response) return auth.response;
  if (!hasSameOrigin(context.request)) {
    return errorResponse(403, "This update must be submitted from the club admin page.");
  }
  if (!context.request.headers.get("Content-Type")?.startsWith("application/json")) {
    return errorResponse(415, "Opening-hours updates must use JSON.");
  }

  try {
    const body = await context.request.json();
    if (!Number.isInteger(body.revision) || body.revision < 1) {
      return errorResponse(400, "A valid revision is required.");
    }

    const saved = await saveOpeningHours(
      context.env.OPENING_HOURS_DB,
      body.config,
      body.revision,
      auth.identity.email,
    );
    if (!saved) {
      return errorResponse(
        409,
        "These hours were changed in another session. Reload before publishing again.",
      );
    }

    return noStore({
      ok: true,
      config: saved.config,
      revision: saved.revision,
      updatedAt: saved.updatedAt,
      updatedBy: saved.updatedBy,
      publicHours: publicOpeningHours(saved),
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      return errorResponse(400, error.message);
    }
    return errorResponse(500, "Opening hours could not be published.");
  }
}
