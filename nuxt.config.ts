import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  srcDir: "src/",
  css: ["~/assets/css/tailwind.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@heroicons/vue", "@headlessui/vue"],
      force: true,
    },
    resolve: {
      alias: {
        "node:async_hooks": "/path/to/empty.js",
      },
    },
  },
  modules: ["@pinia/nuxt", "@nuxthub/core"],
  hub: {},
  nitro: {
    preset: "cloudflare-pages",
    experimental: {
      openAPI: true,
    },
    routeRules: {
      "/api/_hub/**": { swr: true, headers: { "cache-control": "no-cache" } },
    },
    rollupConfig: {
      output: {
        format: "es",
      },
    },
    logLevel: "debug",
    output: {
      serverDir: ".output/server",
      publicDir: ".output/public",
    },
    publicAssets: [
      {
        dir: "src/public",
        baseURL: "/",
      },
    ],
  },
  alias: {
    "@components": "/src/components",
    "@stores": "/src/stores",
    "@plugins": "/src/plugins",
  },
  plugins: ["~/plugins/theme.client.ts"],
  app: {
    baseURL: "/",
    head: {
      htmlAttrs: {
        lang: "en",
        class: "bg-gray-100 dark:bg-gray-900",
      },
    },
  },
});
