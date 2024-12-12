// src/types/nuxt-app.d.ts
declare module "#app" {
  import { NuxtApp } from "nuxt/app";

  // Define Nuxt plugin
  export function defineNuxtPlugin(plugin: (nuxtApp: NuxtApp) => void): void;

  // Runtime Config
  export function useRuntimeConfig(): {
    public: {
      [key: string]: any;
    };
    private?: {
      [key: string]: any;
    };
  };

  // Nuxt App utilities
  export function useNuxtApp(): NuxtApp;

  // Extend NuxtApp
  interface NuxtApp {
    [key: string]: any;
  }
}
