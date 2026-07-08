import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Blackheath Sports Club",
        short_name: "BSC",
        description:
          "Rugby, cricket, tennis, squash, venue hire and social membership at the Rectory Field in South East London.",
        theme_color: "#0b5c43",
        background_color: "#fbfaf6",
        display: "standalone",
        orientation: "portrait-primary",
        scope: ".",
        start_url: ".",
        lang: "en-GB",
        categories: ["sports", "lifestyle"],
        icons: [
          {
            src: "icons/pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/pwa-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: null,
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2,xml,txt}"],
        runtimeCaching: [
          {
            urlPattern: ({ request, sameOrigin }) =>
              sameOrigin && ["image", "font", "style", "script"].includes(request.destination),
            handler: "CacheFirst",
            options: {
              cacheName: "bsc-static-assets",
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: ({ request, sameOrigin }) => sameOrigin && request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "bsc-pages",
              networkTimeoutSeconds: 3,
              precacheFallback: {
                fallbackURL: "offline.html",
              },
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
