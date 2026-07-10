import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Blackheath Sports Club" })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact))).toEqual([]);
});

test("navigation exposes the main journeys", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "mobile") await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Membership" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Venue hire" })).toBeVisible();
});

test("enquiry form exposes validation, privacy and anti-spam controls", async ({ page }) => {
  await page.goto("/#enquire");
  const form = page.locator("form.enquiry-form");
  await expect(form.locator("#q-name")).toHaveAttribute("maxlength", "100");
  await expect(form.locator("#q-message")).toHaveAttribute("maxlength", "2000");
  await expect(form.locator('[aria-label="Anti-spam verification"]')).toBeVisible();
  await expect(form.getByRole("link", { name: "privacy notice" })).toHaveAttribute("href", "privacy.html");
});

test("service worker precaches the shell without gallery photos", async () => {
  const serviceWorker = await readFile("dist/sw.js", "utf8");
  expect(serviceWorker).toContain("offline.html");
  expect(serviceWorker).not.toContain("gallery-juniors");
  expect(serviceWorker).not.toContain("gallery-rugby");
});

test("Cloudflare header policy contains the required protections", async () => {
  const headers = await readFile("public/_headers", "utf8");
  expect(headers).toContain("frame-ancestors 'none'");
  expect(headers).toContain("Permissions-Policy:");
  expect(headers).toContain("Cache-Control: public, max-age=31536000, immutable");
  expect(headers).toContain("/sw.js");
});

test("an uncached navigation receives the offline fallback", async ({ page, context }, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await context.setOffline(true);
  await page.goto(`/offline-check-${testInfo.project.name}`).catch(() => {});
  await expect(page.getByRole("heading", { name: "You are offline" })).toBeVisible();
  await context.setOffline(false);
});
