export const SEASON_IDS = ["summer", "winter"];

export const DAYS = [
  { id: "monday", label: "Monday", short: "Mon" },
  { id: "tuesday", label: "Tuesday", short: "Tue" },
  { id: "wednesday", label: "Wednesday", short: "Wed" },
  { id: "thursday", label: "Thursday", short: "Thu" },
  { id: "friday", label: "Friday", short: "Fri" },
  { id: "saturday", label: "Saturday", short: "Sat" },
  { id: "sunday", label: "Sunday", short: "Sun" },
];

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const NOTICE_LIMIT = 160;

const makeDefaultDays = () =>
  DAYS.map((day, index) => ({
    day: day.id,
    closed: false,
    opens: index < 5 ? "18:00" : "11:30",
    closes: "23:00",
  }));

export const DEFAULT_SEASONAL_HOURS = {
  schemaVersion: 1,
  activeSeason: "summer",
  notice: "",
  seasons: {
    summer: {
      label: "Summer",
      days: makeDefaultDays(),
    },
    winter: {
      label: "Winter",
      days: makeDefaultDays(),
    },
  },
};

const copy = (value) => JSON.parse(JSON.stringify(value));

function validationError(message) {
  const error = new Error(message);
  error.name = "ValidationError";
  return error;
}

export function validateSeasonalHours(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw validationError("Opening hours must be an object.");
  }

  if (!SEASON_IDS.includes(input.activeSeason)) {
    throw validationError("Choose Summer or Winter as the active season.");
  }

  const notice = typeof input.notice === "string" ? input.notice.trim() : "";
  if (notice.length > NOTICE_LIMIT) {
    throw validationError(`The public notice must be ${NOTICE_LIMIT} characters or fewer.`);
  }

  const seasons = {};
  for (const seasonId of SEASON_IDS) {
    const season = input.seasons?.[seasonId];
    if (!season || !Array.isArray(season.days) || season.days.length !== DAYS.length) {
      throw validationError(`${seasonId} must contain all seven days.`);
    }

    const rows = new Map(season.days.map((row) => [row?.day, row]));
    seasons[seasonId] = {
      label: seasonId === "summer" ? "Summer" : "Winter",
      days: DAYS.map(({ id }) => {
        const row = rows.get(id);
        if (!row) throw validationError(`${seasonId} is missing ${id}.`);

        const closed = row.closed === true;
        const opens = typeof row.opens === "string" ? row.opens : "";
        const closes = typeof row.closes === "string" ? row.closes : "";

        if (!closed) {
          if (!TIME_PATTERN.test(opens) || !TIME_PATTERN.test(closes)) {
            throw validationError(`Enter valid opening and closing times for ${id}.`);
          }
          if (opens >= closes) {
            throw validationError(`Closing time must be later than opening time for ${id}.`);
          }
        }

        return {
          day: id,
          closed,
          opens: closed ? "" : opens,
          closes: closed ? "" : closes,
        };
      }),
    };
  }

  return {
    schemaVersion: 1,
    activeSeason: input.activeSeason,
    notice,
    seasons,
  };
}

export function cloneDefaultSeasonalHours() {
  return copy(DEFAULT_SEASONAL_HOURS);
}

export function formatTime(value) {
  if (!TIME_PATTERN.test(value)) return value;
  const [rawHour, minutes] = value.split(":").map(Number);
  const suffix = rawHour >= 12 ? "pm" : "am";
  const hour = rawHour % 12 || 12;
  return `${hour}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""}${suffix}`;
}

function sameHours(left, right) {
  return (
    left.closed === right.closed &&
    left.opens === right.opens &&
    left.closes === right.closes
  );
}

function dayRangeLabel(startIndex, endIndex) {
  if (startIndex === 0 && endIndex === 4) return "Weekdays";
  if (startIndex === 5 && endIndex === 6) return "Weekends";
  if (startIndex === endIndex) return DAYS[startIndex].label;
  return `${DAYS[startIndex].label}-${DAYS[endIndex].label}`;
}

export function groupSchedule(days) {
  const groups = [];
  let startIndex = 0;

  for (let index = 1; index <= days.length; index += 1) {
    if (index < days.length && sameHours(days[startIndex], days[index])) continue;
    const row = days[startIndex];
    groups.push({
      days: dayRangeLabel(startIndex, index - 1),
      time: row.closed
        ? "Closed"
        : `${formatTime(row.opens)} \u2013 ${formatTime(row.closes)}`,
      closed: row.closed,
    });
    startIndex = index;
  }

  return groups;
}

export function toPublicOpeningHours(config, metadata = {}) {
  const valid = validateSeasonalHours(config);
  const active = valid.seasons[valid.activeSeason];
  return {
    schemaVersion: valid.schemaVersion,
    activeSeason: valid.activeSeason,
    seasonLabel: active.label,
    notice: valid.notice,
    hours: groupSchedule(active.days),
    days: copy(active.days),
    revision: Number.isInteger(metadata.revision) ? metadata.revision : 0,
    updatedAt: metadata.updatedAt || null,
  };
}

export function toOpeningHoursSpecification(days) {
  return days
    .filter((row) => !row.closed)
    .map((row) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAYS.find((day) => day.id === row.day)?.label || row.day,
      opens: row.opens,
      closes: row.closes,
    }));
}
