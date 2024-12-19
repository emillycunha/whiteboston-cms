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
  modules: ["@pinia/nuxt"],
  nitro: {
    preset: "static",
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
        class: "bg-gray-100 dark:bg-gray-900",
      },
    },
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_SUPABASE_ANON_KEY,
    },
  },
  plugins: [{ src: "~/plugins/supabase.client", mode: "client" }],
  ssr: false, // Disable SSR globally
});
