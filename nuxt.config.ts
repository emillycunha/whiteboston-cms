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

  modules: ["@pinia/nuxt", "@nuxthub/core"],
  hub: {
    database: true,
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
    public: {},
  },
});
