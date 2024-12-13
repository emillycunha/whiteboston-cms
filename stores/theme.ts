// stores/theme.ts
export const useThemeStore = defineStore("theme", {
  state: () => ({
    isDarkMode: false,
  }),
  persist: true, // This tells the plugin to persist this store's state
  actions: {
    initializeTheme() {
      const isDark = document.documentElement.classList.contains("dark");
      this.isDarkMode = isDark;
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      const theme = this.isDarkMode ? "dark" : "light";
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(theme);
    },
  },
});
