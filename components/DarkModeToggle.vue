<template>
  <div v-if="isExpanded" class="flex flex-row items-center gap-x-2 justify-center transition-all duration-300">
    <SunIcon class="h-5 w-5 text-gray-700 dark:text-gray-300" />
    <Switch v-model="authStore.darkmode" :class="authStore.darkmode ? 'bg-gray-600' : 'bg-violet-100'" class="relative inline-flex h-6 w-11 items-center rounded-full" @click="toggleDarkMode">
      <span class="sr-only">Dark Mode</span>
      <span :class="authStore.darkmode ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-teal-500 transition"></span>
    </Switch>
    <MoonIcon class="h-5 w-5 text-gray-700 dark:text-gray-300" />
  </div>
  <div v-else class="transition-all duration-300">
    <button @click="toggleDarkMode">
      <SunIcon v-if="isDarkMode" class="h-5 w-5 text-gray-700 dark:text-gray-300" />
      <MoonIcon v-else class="h-5 w-5 text-gray-700 dark:text-gray-300" />
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
import { MoonIcon, SunIcon } from "@heroicons/vue/24/outline";
import { Switch } from "@headlessui/vue";

const authStore = useAuthStore();
const isDarkMode = computed(() => authStore.preferences.darkmode);
const toggleDarkMode = () => {
  authStore.toggleDarkMode();
};

defineProps({
  isExpanded: Boolean,
});
</script>
