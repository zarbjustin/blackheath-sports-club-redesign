import { cloneDefaultSeasonalHours, toPublicOpeningHours } from "../../shared/seasonal-hours.js";
import { publicOpeningHours, readOpeningHours } from "../lib/opening-hours-store.js";
import { json } from "../lib/responses.js";

export async function onRequestGet(context) {
  try {
    if (!context.env.OPENING_HOURS_DB) throw new Error("Database binding is unavailable.");
    const record = await readOpeningHours(context.env.OPENING_HOURS_DB);
    return json(
      { ok: true, source: "database", ...publicOpeningHours(record) },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-if-error=86400",
        },
      },
    );
  } catch {
    return json(
      {
        ok: true,
        source: "fallback",
        ...toPublicOpeningHours(cloneDefaultSeasonalHours()),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=60",
          "X-Opening-Hours-Source": "fallback",
        },
      },
    );
  }
}
