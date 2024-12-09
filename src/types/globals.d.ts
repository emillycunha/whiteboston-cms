// src/types/globals.d.ts
import type { RouteLocationRaw } from "vue-router";

declare function navigateTo(
  to: string | RouteLocationRaw,
  options?: { replace?: boolean; redirectCode?: number }
): Promise<void>;
