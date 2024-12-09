// src/types/nuxt.d.ts
import { NuxtConfig } from "nuxt/schema";

declare module "nuxt/schema" {
  export function defineNuxtConfig(config: NuxtConfig): NuxtConfig;
}

export {};
