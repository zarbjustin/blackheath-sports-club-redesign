import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  Check,
  Clock3,
  CloudAlert,
  History,
  LoaderCircle,
  RotateCcw,
  Save,
} from "lucide-react";
import "@fontsource-variable/inter";
import {
  DAYS,
  cloneDefaultSeasonalHours,
  groupSchedule,
  SEASON_IDS,
  validateSeasonalHours,
} from "../shared/seasonal-hours.js";
import clubCrest from "./assets/brand/bsc-crest.svg";
import "./admin.css";

const API_URL = "/admin/api/opening-hours";

function formatPublished(value) {
  if (!value) return "Not published yet";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(new Date(value));
}

function AdminApp() {
  const [config, setConfig] = useState(cloneDefaultSeasonalHours);
  const [revision, setRevision] = useState(0);
  const [editingSeason, setEditingSeason] = useState("summer");
  const [history, setHistory] = useState([]);
  const [administrator, setAdministrator] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [updatedBy, setUpdatedBy] = useState("");
  const [state, setState] = useState("loading");
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    document.title = "Opening Hours Admin | Blackheath Sports Club";
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = "noindex, nofollow, noarchive";
  }, []);

  async function load() {
    setState("loading");
    setMessage("");
    try {
      const response = await fetch(API_URL, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Opening hours could not be loaded.");
      setConfig(validateSeasonalHours(body.config));
      setRevision(body.revision);
      setHistory(body.history || []);
      setAdministrator(body.administrator || "");
      setUpdatedAt(body.updatedAt);
      setUpdatedBy(body.updatedBy || "");
      setDirty(false);
      setState("ready");
    } catch (error) {
      if (
        import.meta.env.DEV ||
        ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ) {
        setConfig(cloneDefaultSeasonalHours());
        setRevision(1);
        setAdministrator("local preview");
        setUpdatedBy("migration");
        setDirty(false);
        setState("ready");
        return;
      }
      setMessage(error instanceof Error ? error.message : "Opening hours could not be loaded.");
      setState("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const previewGroups = useMemo(
    () => groupSchedule(config.seasons[config.activeSeason].days),
    [config],
  );

  function updateConfig(updater) {
    setConfig((current) => {
      const next = structuredClone(current);
      updater(next);
      return next;
    });
    setDirty(true);
    setMessage("");
  }

  function updateDay(dayId, field, value) {
    updateConfig((next) => {
      const row = next.seasons[editingSeason].days.find((day) => day.day === dayId);
      row[field] = value;
      if (field === "closed" && value === false) {
        row.opens ||= "18:00";
        row.closes ||= "23:00";
      }
    });
  }

  function copyWeekdayHours() {
    updateConfig((next) => {
      const days = next.seasons[editingSeason].days;
      const monday = days[0];
      for (const day of days.slice(1, 5)) {
        Object.assign(day, {
          closed: monday.closed,
          opens: monday.opens,
          closes: monday.closes,
        });
      }
    });
  }

  function copyWeekendHours() {
    updateConfig((next) => {
      const days = next.seasons[editingSeason].days;
      Object.assign(days[6], {
        closed: days[5].closed,
        opens: days[5].opens,
        closes: days[5].closes,
      });
    });
  }

  async function publish() {
    setState("saving");
    setMessage("");
    try {
      const valid = validateSeasonalHours(config);
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ revision, config: valid }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Opening hours could not be published.");
      setConfig(body.config);
      setRevision(body.revision);
      setUpdatedAt(body.updatedAt);
      setUpdatedBy(body.updatedBy);
      setHistory((current) => [
        {
          revision: body.revision,
          changed_at: body.updatedAt,
          changed_by: body.updatedBy,
        },
        ...current,
      ].slice(0, 8));
      setDirty(false);
      setMessage("Opening hours published.");
      setState("saved");
      window.setTimeout(() => setState("ready"), 1800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Opening hours could not be published.");
      setState("error");
    }
  }

  if (state === "loading") {
    return (
      <main className="admin-state">
        <LoaderCircle className="spin" size={28} />
        <p>Loading opening hours</p>
      </main>
    );
  }

  if (state === "error" && revision === 0) {
    return (
      <main className="admin-state">
        <CloudAlert size={34} />
        <h1>Opening hours are unavailable</h1>
        <p>{message}</p>
        <button className="admin-button primary" type="button" onClick={load}>
          <RotateCcw size={18} /> Retry
        </button>
      </main>
    );
  }

  const season = config.seasons[editingSeason];

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-brand">
          <img src={clubCrest} alt="" width={1207} height={1207} />
          <span>
            Blackheath
            <strong>Sports Club</strong>
          </span>
        </div>
        <a className="admin-back" href="../">
          <ArrowLeft size={17} /> Website
        </a>
      </header>

      <main className="admin-main">
        <div className="admin-title">
          <div>
            <p className="admin-eyebrow">Club administration</p>
            <h1>Bar opening hours</h1>
          </div>
          <div className="publish-meta">
            <span>{formatPublished(updatedAt)}</span>
            {updatedBy && <small>Published by {updatedBy}</small>}
          </div>
        </div>

        <section className="admin-band" aria-labelledby="active-season-title">
          <div>
            <h2 id="active-season-title">Active season</h2>
            <p>The selected schedule appears on the public website.</p>
          </div>
          <div className="season-switch" role="group" aria-label="Active season">
            {SEASON_IDS.map((seasonId) => (
              <button
                key={seasonId}
                type="button"
                className={config.activeSeason === seasonId ? "is-active" : ""}
                aria-pressed={config.activeSeason === seasonId}
                onClick={() => updateConfig((next) => { next.activeSeason = seasonId; })}
              >
                {config.seasons[seasonId].label}
              </button>
            ))}
          </div>
        </section>

        <div className="admin-workspace">
          <section className="schedule-editor" aria-labelledby="schedule-title">
            <div className="editor-toolbar">
              <div>
                <h2 id="schedule-title">Season schedules</h2>
                <div className="editor-tabs" role="tablist" aria-label="Schedule to edit">
                  {SEASON_IDS.map((seasonId) => (
                    <button
                      key={seasonId}
                      type="button"
                      role="tab"
                      aria-selected={editingSeason === seasonId}
                      className={editingSeason === seasonId ? "is-active" : ""}
                      onClick={() => setEditingSeason(seasonId)}
                    >
                      {config.seasons[seasonId].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="copy-actions">
                <button type="button" onClick={copyWeekdayHours}>Copy Monday to weekdays</button>
                <button type="button" onClick={copyWeekendHours}>Copy Saturday to Sunday</button>
              </div>
            </div>

            <div className="schedule-table">
              <div className="schedule-heading" aria-hidden="true">
                <span>Day</span>
                <span>Opens</span>
                <span>Closes</span>
                <span>Closed</span>
              </div>
              {season.days.map((row) => {
                const day = DAYS.find((item) => item.id === row.day);
                return (
                  <div className="schedule-row" key={row.day}>
                    <strong>{day.label}</strong>
                    <label>
                      <span className="mobile-label">Opens</span>
                      <input
                        type="time"
                        value={row.opens}
                        disabled={row.closed}
                        aria-label={`${day.label} opening time`}
                        onChange={(event) => updateDay(row.day, "opens", event.target.value)}
                      />
                    </label>
                    <label>
                      <span className="mobile-label">Closes</span>
                      <input
                        type="time"
                        value={row.closes}
                        disabled={row.closed}
                        aria-label={`${day.label} closing time`}
                        onChange={(event) => updateDay(row.day, "closes", event.target.value)}
                      />
                    </label>
                    <label className="closed-control">
                      <input
                        type="checkbox"
                        checked={row.closed}
                        onChange={(event) => updateDay(row.day, "closed", event.target.checked)}
                      />
                      <span>Closed</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="hours-preview" aria-labelledby="preview-title">
            <div className="preview-heading">
              <Clock3 size={20} />
              <div>
                <span>Public preview</span>
                <h2 id="preview-title">{config.seasons[config.activeSeason].label} hours</h2>
              </div>
            </div>
            <dl>
              {previewGroups.map((group) => (
                <div key={group.days}>
                  <dt>{group.days}</dt>
                  <dd>{group.time}</dd>
                </div>
              ))}
            </dl>
            <label className="notice-field" htmlFor="public-notice">
              Public notice
              <textarea
                id="public-notice"
                rows="3"
                maxLength="160"
                value={config.notice}
                placeholder="Optional short notice"
                onChange={(event) => updateConfig((next) => { next.notice = event.target.value; })}
              />
              <small>{config.notice.length}/160</small>
            </label>
          </aside>
        </div>

        <section className="publish-bar" aria-label="Publish opening hours">
          <div aria-live="polite">
            {message && (
              <p className={state === "error" ? "status-error" : "status-success"}>
                {state === "error" ? <CloudAlert size={17} /> : <Check size={17} />}
                {message}
              </p>
            )}
            {!message && <span>{dirty ? "Unpublished changes" : "Everything is published"}</span>}
          </div>
          <button
            className="admin-button primary"
            type="button"
            disabled={!dirty || state === "saving"}
            onClick={publish}
          >
            {state === "saving" ? <LoaderCircle className="spin" size={18} /> : <Save size={18} />}
            {state === "saving" ? "Publishing" : "Publish hours"}
          </button>
        </section>

        <section className="history-section" aria-labelledby="history-title">
          <div className="history-title">
            <History size={19} />
            <h2 id="history-title">Recent publications</h2>
          </div>
          {history.length ? (
            <table>
              <thead>
                <tr><th>Revision</th><th>Published</th><th>Administrator</th></tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={`${entry.revision}-${entry.changed_at}`}>
                    <td>{entry.revision}</td>
                    <td>{formatPublished(entry.changed_at)}</td>
                    <td>{entry.changed_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-history">No changes have been published since setup.</p>
          )}
        </section>
      </main>

      <footer className="admin-footer">
        <span>{administrator ? `Signed in as ${administrator}` : "Authenticated administrator"}</span>
        <span>Revision {revision}</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("admin-root")).render(<AdminApp />);
