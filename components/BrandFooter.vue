<template>
  <div class="text-center mt-2">
    <p class="mt-6 text-xs text-gray-500 dark:text-gray-300">
      &copy; {{ currentYear }} WhiteBoston CMS
    </p>
    <p class="text-xs text-gray-500 dark:text-gray-300">{{ version }}</p>
  </div>
  <div class="text-center mt-2">
    <!-- Demo Banner -->
    <div class="text-xs bg-red-50 text-red-500 text-center py-2 font-semibold">
      This is a demo of WhiteBostonCMS. Data resets every hour. Changes will not
      be saved permanently.
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const version = config.public.appVersion;
const currentYear = new Date().getFullYear();
</script>
