<script setup>
import { useAuthStore } from "~/stores/auth";
import { MoonIcon, SunIcon } from "@heroicons/vue/24/outline";
import { Switch } from "@headlessui/vue";

const authStore = useAuthStore();

const toggleDarkMode = () => {
  authStore.toggleDarkMode();
};
</script>

<template>
  <div class="flex flex-row items-center gap-x-2 justify-center">
    <SunIcon class="h-5 w-5 text-gray-700 dark:text-gray-300" />
    <Switch
      v-model="authStore.darkmode"
      :class="authStore.darkmode ? 'bg-gray-600' : 'bg-violet-100'"
      class="relative inline-flex h-6 w-11 items-center rounded-full"
      @click="toggleDarkMode"
    >
      <span class="sr-only">Dark Mode</span>
      <span
        :class="authStore.darkmode ? 'translate-x-6' : 'translate-x-1'"
        class="inline-block h-4 w-4 transform rounded-full bg-teal-500 transition"
      />
    </Switch>
    <MoonIcon class="h-5 w-5 text-gray-700 dark:text-gray-300" />
  </div>
</template>
