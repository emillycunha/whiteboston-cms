// src/types/supabase.d.ts
import { SupabaseClient } from "@supabase/supabase-js";

declare module "#app" {
  interface NuxtApp {
    $supabase: SupabaseClient;
  }
}

export {};
