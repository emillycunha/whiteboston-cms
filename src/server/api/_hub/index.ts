// src/server/api/_hub/index.ts
import { defineEventHandler } from "h3";

export default defineEventHandler(() => {
  return {
    message: "This is the NuxtHub endpoint.",
  };
});
