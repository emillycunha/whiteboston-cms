// src/types/nuxt-app.d.ts
declare module "#app" {
  import { NuxtApp } from "nuxt/app";
  import { SupabaseClient } from "@supabase/supabase-js";

  // Define Nuxt plugin
  export function defineNuxtPlugin(plugin: (nuxtApp: NuxtApp) => void): void;

  // Runtime Config
  export function useRuntimeConfig(): {
    public: {
      supabaseUrl: string;
      supabaseAnonKey: string;
    };
    private?: {
      [key: string]: any;
    };
  };

  // Nuxt App utilities
  export function useNuxtApp(): NuxtApp;

  // Extend NuxtApp with $supabase
  interface NuxtApp {
    $supabase: SupabaseClient;
  }
}
