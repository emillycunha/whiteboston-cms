// src/types/process.d.ts
declare namespace NodeJS {
  interface Process {
    client: boolean;
    server: boolean;
    dev: boolean; // Optional: available in Nuxt dev mode
  }
}
