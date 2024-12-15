<script setup>
import { useThemeStore } from "~/stores/theme";
import { MoonIcon, SunIcon } from "@heroicons/vue/24/outline";
import { Switch } from "@headlessui/vue";

const themeStore = useThemeStore();

const toggleTheme = () => {
  themeStore.toggleTheme();
};

import { ref } from "vue";
const enabled = ref(false);
</script>

<template>
  <div class="flex flex-row items-center gap-x-2 justify-center">
    <SunIcon class="size-5 text-gray-700 dark:text-gray-300" />
    <Switch
      v-model="enabled"
      @click="toggleTheme"
      :class="enabled ? 'bg-gray-600' : 'bg-violet-100'"
      class="relative inline-flex h-6 w-11 items-center rounded-full"
    >
      <span class="sr-only">Dark Mode</span>
      <span
        :class="enabled ? 'translate-x-6' : 'translate-x-1 bg-violet-500'"
        class="inline-block h-4 w-4 transform rounded-full bg-teal-500 transition"
      />
    </Switch>
    <MoonIcon class="size-5 text-gray-700 dark:text-gray-300" />
  </div>
</template>
