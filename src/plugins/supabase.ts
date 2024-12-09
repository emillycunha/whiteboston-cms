// plugins/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { defineNuxtPlugin, useRuntimeConfig } from "#app";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  );

  return {
    provide: {
      supabase,
    },
  };
});
