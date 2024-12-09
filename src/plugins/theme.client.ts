// plugins/theme.client.ts
import { defineNuxtPlugin } from "#app";
import { useThemeStore } from "~/stores/theme";

export default defineNuxtPlugin(() => {
  if (process.client) {
    const themeStore = useThemeStore();
    themeStore.initializeTheme();
  }
});
