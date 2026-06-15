import { readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// Read whichever JSON is active in config.ts at build time
const configSrc = readFileSync(
  resolve(__dirname, "src/data/config.ts"),
  "utf-8",
);
const match = configSrc.match(/^import data from ['"]\.\/(.+?)\.json['"]/m);
const jsonFile = match ? match[1] : "cottage";
const property = JSON.parse(
  readFileSync(resolve(__dirname, `src/data/${jsonFile}.json`), "utf-8"),
).property;

export default defineConfig({
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "src/index.html",
        arrival: "src/arrival.html",
        "house-manual": "src/house-manual.html",
        emergency: "src/emergency.html",
        departure: "src/departure.html",
        "places-to-eat": "src/places-to-eat.html",
        attractions: "src/attractions.html",
        beaches: "src/beaches.html",
      },
    },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: property.title,
        short_name: property.shortName,
        description: property.description,
        theme_color: property.themeColor,
        background_color: "#f5f5f5",
        display: "standalone",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          { src: "apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{css,js,html,svg,png,ico,jpg,jpeg,webp,avif}"],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
      devOptions: { enabled: true },
    }),
  ],
});
