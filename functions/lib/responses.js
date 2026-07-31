const BASE_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...BASE_HEADERS,
      ...(init.headers || {}),
    },
  });
}

export function errorResponse(status, message, extra = {}) {
  return json({ ok: false, error: message, ...extra }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
