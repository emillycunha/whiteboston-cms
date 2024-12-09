import { defineNuxtConfig } from "nuxt/config";
import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables are missing!");
}

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
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@heroicons/vue", "@headlessui/vue"],
      force: true,
    },
  },
  modules: ["@pinia/nuxt"],
  alias: {
    "@components": "/src/components",
    "@stores": "/src/stores",
    "@plugins": "/src/plugins",
  },
  plugins: ["~/plugins/supabase.ts", "~/plugins/theme.client.ts"],
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
        class: "bg-gray-100 dark:bg-gray-900",
      },
    },
  },
});
