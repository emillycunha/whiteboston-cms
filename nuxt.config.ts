import { version } from "./package.json";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  modules: ["@pinia/nuxt", "@nuxt/eslint"],
  nitro: {
    preset: "static",
  },
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
    },
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
  ssr: false,
});
