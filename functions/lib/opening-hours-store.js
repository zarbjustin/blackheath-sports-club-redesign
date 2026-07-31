import {
  cloneDefaultSeasonalHours,
  toPublicOpeningHours,
  validateSeasonalHours,
} from "../../shared/seasonal-hours.js";

export async function readOpeningHours(db) {
  const row = await db
    .prepare(
      "SELECT config_json, revision, updated_at, updated_by FROM seasonal_hours WHERE id = 1",
    )
    .first();

  if (!row) {
    return {
      config: cloneDefaultSeasonalHours(),
      revision: 0,
      updatedAt: null,
      updatedBy: "fallback",
    };
  }

  return {
    config: validateSeasonalHours(JSON.parse(row.config_json)),
    revision: Number(row.revision),
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

export async function readRecentHistory(db) {
  const result = await db
    .prepare(
      `SELECT revision, changed_at, changed_by
       FROM seasonal_hours_revisions
       ORDER BY id DESC
       LIMIT 8`,
    )
    .all();

  return result.results || [];
}

export async function saveOpeningHours(db, config, expectedRevision, updatedBy) {
  const valid = validateSeasonalHours(config);
  const nextRevision = expectedRevision + 1;
  const updatedAt = new Date().toISOString();
  const result = await db
    .prepare(
      `UPDATE seasonal_hours
       SET config_json = ?, revision = ?, updated_at = ?, updated_by = ?
       WHERE id = 1 AND revision = ?`,
    )
    .bind(JSON.stringify(valid), nextRevision, updatedAt, updatedBy, expectedRevision)
    .run();

  if (result.meta?.changes !== 1) return null;
  return {
    config: valid,
    revision: nextRevision,
    updatedAt,
    updatedBy,
  };
}

export function publicOpeningHours(record) {
  return toPublicOpeningHours(record.config, {
    revision: record.revision,
    updatedAt: record.updatedAt,
  });
}
