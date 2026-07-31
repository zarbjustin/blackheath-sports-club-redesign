import assert from "node:assert/strict";
import test from "node:test";
import {
  cloneDefaultSeasonalHours,
  groupSchedule,
  toOpeningHoursSpecification,
  toPublicOpeningHours,
  validateSeasonalHours,
} from "../shared/seasonal-hours.js";

test("default schedules preserve the existing public opening hours", () => {
  const publicHours = toPublicOpeningHours(cloneDefaultSeasonalHours());
  assert.equal(publicHours.seasonLabel, "Summer");
  assert.deepEqual(publicHours.hours, [
    { days: "Weekdays", time: "6pm \u2013 11pm", closed: false },
    { days: "Weekends", time: "11:30am \u2013 11pm", closed: false },
  ]);
});

test("the active season controls the public schedule", () => {
  const config = cloneDefaultSeasonalHours();
  config.activeSeason = "winter";
  config.seasons.winter.days[0].opens = "17:00";
  config.seasons.winter.days[0].closes = "22:00";

  const publicHours = toPublicOpeningHours(config);
  assert.equal(publicHours.seasonLabel, "Winter");
  assert.deepEqual(publicHours.hours[0], {
    days: "Monday",
    time: "5pm \u2013 10pm",
    closed: false,
  });
});

test("closed days are grouped and excluded from structured opening hours", () => {
  const config = cloneDefaultSeasonalHours();
  for (const row of config.seasons.summer.days.slice(0, 2)) {
    row.closed = true;
    row.opens = "";
    row.closes = "";
  }

  const valid = validateSeasonalHours(config);
  const groups = groupSchedule(valid.seasons.summer.days);
  const structured = toOpeningHoursSpecification(valid.seasons.summer.days);

  assert.deepEqual(groups[0], {
    days: "Monday-Tuesday",
    time: "Closed",
    closed: true,
  });
  assert.equal(structured.some((entry) => entry.dayOfWeek === "Monday"), false);
  assert.equal(structured.length, 5);
});

test("closing times must be later than opening times", () => {
  const config = cloneDefaultSeasonalHours();
  config.seasons.summer.days[0].opens = "23:00";
  config.seasons.summer.days[0].closes = "18:00";

  assert.throws(
    () => validateSeasonalHours(config),
    /Closing time must be later than opening time/,
  );
});

test("public notices are trimmed and length limited", () => {
  const config = cloneDefaultSeasonalHours();
  config.notice = "  Kitchen closes 30 minutes earlier.  ";
  assert.equal(
    validateSeasonalHours(config).notice,
    "Kitchen closes 30 minutes earlier.",
  );

  config.notice = "x".repeat(161);
  assert.throws(() => validateSeasonalHours(config), /160 characters or fewer/);
});
