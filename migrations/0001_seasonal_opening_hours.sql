CREATE TABLE IF NOT EXISTS seasonal_hours (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  config_json TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS seasonal_hours_revisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  revision INTEGER NOT NULL,
  previous_config_json TEXT NOT NULL,
  new_config_json TEXT NOT NULL,
  changed_at TEXT NOT NULL,
  changed_by TEXT NOT NULL
);

CREATE TRIGGER IF NOT EXISTS seasonal_hours_audit
AFTER UPDATE ON seasonal_hours
FOR EACH ROW
BEGIN
  INSERT INTO seasonal_hours_revisions (
    revision,
    previous_config_json,
    new_config_json,
    changed_at,
    changed_by
  ) VALUES (
    NEW.revision,
    OLD.config_json,
    NEW.config_json,
    NEW.updated_at,
    NEW.updated_by
  );
END;

INSERT OR IGNORE INTO seasonal_hours (
  id,
  config_json,
  revision,
  updated_at,
  updated_by
) VALUES (
  1,
  '{"schemaVersion":1,"activeSeason":"summer","notice":"","seasons":{"summer":{"label":"Summer","days":[{"day":"monday","closed":false,"opens":"18:00","closes":"23:00"},{"day":"tuesday","closed":false,"opens":"18:00","closes":"23:00"},{"day":"wednesday","closed":false,"opens":"18:00","closes":"23:00"},{"day":"thursday","closed":false,"opens":"18:00","closes":"23:00"},{"day":"friday","closed":false,"opens":"18:00","closes":"23:00"},{"day":"saturday","closed":false,"opens":"11:30","closes":"23:00"},{"day":"sunday","closed":false,"opens":"11:30","closes":"23:00"}]},"winter":{"label":"Winter","days":[{"day":"monday","closed":false,"opens":"18:00","closes":"23:00"},{"day":"tuesday","closed":false,"opens":"18:00","closes":"23:00"},{"day":"wednesday","closed":false,"opens":"18:00","closes":"23:00"},{"day":"thursday","closed":false,"opens":"18:00","closes":"23:00"},{"day":"friday","closed":false,"opens":"18:00","closes":"23:00"},{"day":"saturday","closed":false,"opens":"11:30","closes":"23:00"},{"day":"sunday","closed":false,"opens":"11:30","closes":"23:00"}]}}}',
  1,
  CURRENT_TIMESTAMP,
  'migration'
);
