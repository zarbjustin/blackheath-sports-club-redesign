const cloudflareBeaconSrc = "https://static.cloudflareinsights.com/beacon.min.js";

function cleanProps(props = {}) {
  return Object.fromEntries(
    Object.entries(props)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, String(value).slice(0, 120)])
  );
}

export function loadCloudflareAnalytics(config) {
  if (!config?.enabled || !config.siteToken || typeof document === "undefined") return;
  if (document.querySelector("script[data-bsc-cloudflare-analytics]")) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = cloudflareBeaconSrc;
  script.dataset.bscCloudflareAnalytics = "true";
  script.dataset.cfBeacon = JSON.stringify({ token: config.siteToken });
  document.head.appendChild(script);
}

export function trackEvent(name, props = {}) {
  const eventProps = cleanProps(props);

  if (typeof window === "undefined") return;

  if (window.zaraz?.track) {
    window.zaraz.track(name, eventProps);
  }

  if (window.plausible) {
    window.plausible(name, { props: eventProps });
  }

  if (window.goatcounter?.count) {
    window.goatcounter.count({
      path: `event:${name}`,
      title: Object.keys(eventProps).length
        ? `${name} ${JSON.stringify(eventProps)}`
        : name,
      event: true,
    });
  }

  try {
    if (window.localStorage?.getItem("bsc_analytics_debug") === "1") {
      console.info("[analytics]", name, eventProps);
    }
  } catch {
    // Ignore browsers that block localStorage access.
  }
}

export function trackOutbound(category, label, url) {
  trackEvent("outbound_click", { category, label, url });
}
