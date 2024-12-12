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
  nitro: {
    preset: "cloudflare-pages",
    externals: {
      inline: [],
    },
    rollupConfig: {
      output: {
        format: "es",
      },
    },
    replace: {
      "import 'node:async_hooks';": "", // Completely strip async_hooks from output
    },
    logLevel: "debug",
    output: {
      publicDir: "dist",
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
    head: {
      htmlAttrs: {
        lang: "en",
        class: "bg-gray-100 dark:bg-gray-900",
      },
    },
  },
});
