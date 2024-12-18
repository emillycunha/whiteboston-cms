import { SupabaseClient } from "@supabase/supabase-js";

declare module "#app" {
  interface NuxtApp {
    $supabase: SupabaseClient;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $supabase: SupabaseClient;
  }
}

export {};
