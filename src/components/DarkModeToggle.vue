<script setup>
import { useThemeStore } from "~/stores/theme";
import { MoonIcon, SunIcon } from "@heroicons/vue/24/outline";

const themeStore = useThemeStore();

const toggleTheme = () => {
  themeStore.toggleTheme();
};
</script>

<template>
  <button
    @click="toggleTheme"
    class="p-1.5 rounded-full bg-gray-200 dark:bg-gray-800"
  >
    <span v-if="themeStore.isDarkMode" class="text-white"
      ><SunIcon class="size-6 text-teal-500"
    /></span>
    <span v-else class="text-gray-800"
      ><MoonIcon class="size-6 text-gray-800"
    /></span>
  </button>
</template>
