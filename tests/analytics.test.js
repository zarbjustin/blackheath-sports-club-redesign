import { afterEach, describe, expect, it, vi } from "vitest";
import { loadCloudflareAnalytics, trackEvent, trackOutbound } from "../src/analytics.js";

afterEach(() => {
  document.head.innerHTML = "";
  delete window.zaraz;
  delete window.plausible;
  delete window.goatcounter;
});

describe("analytics helpers", () => {
  it("does not load a beacon without an enabled token", () => {
    loadCloudflareAnalytics({ enabled: false, siteToken: "" });
    expect(document.querySelector("script[data-bsc-cloudflare-analytics]")).toBeNull();
  });

  it("loads the Cloudflare beacon only once", () => {
    const config = { enabled: true, siteToken: "site-token" };
    loadCloudflareAnalytics(config);
    loadCloudflareAnalytics(config);
    const scripts = document.querySelectorAll("script[data-bsc-cloudflare-analytics]");
    expect(scripts).toHaveLength(1);
    expect(scripts[0].dataset.cfBeacon).toContain("site-token");
  });

  it("normalizes outbound events for an available provider", () => {
    window.zaraz = { track: vi.fn() };
    trackOutbound("sport", "Rugby", "https://example.com");
    expect(window.zaraz.track).toHaveBeenCalledWith("outbound_click", {
      category: "sport",
      label: "Rugby",
      url: "https://example.com",
    });
  });

  it("truncates event properties before sending", () => {
    window.plausible = vi.fn();
    trackEvent("test", { detail: "x".repeat(200) });
    expect(window.plausible.mock.calls[0][1].props.detail).toHaveLength(120);
  });
});
