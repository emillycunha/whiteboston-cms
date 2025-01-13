import { version } from "./package.json";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  content: {
    documentDriven: {
      injectPage: false,
    },
  },
  modules: ["@pinia/nuxt", "@nuxt/content", "@nuxt/eslint"],
  nitro: {
    preset: "static",
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      bodyAttrs: {
        class: "bg-gray-100 dark:bg-gray-900 transition-colors duration-300",
      },
    },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_SUPABASE_ANON_KEY,
      appVersion: version,
    },
  },
  plugins: [{ src: "~/plugins/supabase.client", mode: "client" }],
  ssr: true,
});