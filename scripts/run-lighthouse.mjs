import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import process from "node:process";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const port = 4174;
const origin = `http://127.0.0.1:${port}`;
const reportDir = "reports/lighthouse";
const categories = ["performance", "accessibility", "best-practices", "seo"];
const targets = [
  {
    name: "home",
    path: "/",
    runs: 3,
    minimums: { performance: 0.9, accessibility: 0.95, "best-practices": 0.95, seo: 0.95 },
  },
  {
    name: "privacy",
    path: "/privacy.html",
    runs: 1,
    minimums: { performance: 0.9, accessibility: 0.95, "best-practices": 0.95, seo: 0.9 },
  },
];

function waitForServer(url, timeoutMs = 20_000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) return resolve();
      } catch {
        // The preview process may still be starting.
      }
      if (Date.now() - started >= timeoutMs) return reject(new Error(`Preview did not start at ${url}`));
      setTimeout(check, 250);
    };
    check();
  });
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function stopPreview(child) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    delay(2_000),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
  child.unref();
}

await mkdir(reportDir, { recursive: true });
const preview = spawn("npm", ["run", "preview", "--", "--port", String(port)], {
  stdio: "ignore",
});

let chrome;
try {
  await waitForServer(origin);
  chrome = await launch({
    chromePath: process.env.CHROME_PATH || undefined,
    chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
  });

  let failed = false;
  for (const target of targets) {
    const scores = Object.fromEntries(categories.map((category) => [category, []]));

    for (let run = 1; run <= target.runs; run += 1) {
      console.log(`Running Lighthouse for ${target.name} (${run}/${target.runs})`);
      const result = await lighthouse(
        `${origin}${target.path}`,
        {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: categories,
          throttlingMethod: "simulate",
          maxWaitForFcp: 10_000,
          maxWaitForLoad: 15_000,
        },
      );
      if (!result?.lhr) throw new Error(`Lighthouse did not return a report for ${target.name}`);

      await writeFile(`${reportDir}/${target.name}-${run}.json`, JSON.stringify(result.lhr));
      for (const category of categories) scores[category].push(result.lhr.categories[category].score);
    }

    const summary = Object.fromEntries(categories.map((category) => [category, median(scores[category])]));
    console.log(`${target.name}: ${categories.map((category) => `${category}=${Math.round(summary[category] * 100)}`).join(" ")}`);

    for (const [category, minimum] of Object.entries(target.minimums)) {
      if (summary[category] < minimum) {
        failed = true;
        console.error(`${target.name} ${category} score ${summary[category]} is below ${minimum}`);
      }
    }
  }

  if (failed) process.exitCode = 1;
} finally {
  if (chrome) {
    await Promise.race([Promise.resolve(chrome.kill()).catch(() => undefined), delay(3_000)]);
    if (chrome.pid) {
      try {
        process.kill(chrome.pid, "SIGKILL");
      } catch {
        // Chrome already exited cleanly.
      }
    }
  }
  await stopPreview(preview);
}
