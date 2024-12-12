<script setup>
import { useThemeStore } from "~/stores/theme";
import { MoonIcon, SunIcon } from "@heroicons/vue/24/outline";
import { Switch } from "@headlessui/vue";

const themeStore = useThemeStore();

const toggleTheme = () => {
  themeStore.toggleTheme();
};
</script>

<template>
  <div class="flex flex-row items-center gap-x-2 justify-center">
    <MoonIcon class="size-5 text-gray-700 dark:text-white" />

    <Switch
      @click="toggleTheme"
      class="group inline-flex h-8 w-12 items-center rounded-full bg-gray-200 dark:bg-gray-700"
    >
      <span
        v-if="themeStore.isDarkMode"
        class="size-6 translate-x-1 rounded-full bg-gray-400 transition group-data-[checked]:translate-x-6"
      ></span>
      <span
        v-else
        class="size-6 translate-x-5 rounded-full bg-white transition group-data-[checked]:translate-x-6"
      ></span>
    </Switch>
    <SunIcon class="size-5 text-gray-700 dark:text-white" />
  </div>
</template>
