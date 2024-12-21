<template>
  <div class="text-center mt-2">
    <p class="mt-6 text-xs text-gray-700 dark:text-gray-300">
      &copy; {{ currentYear }} WhiteBoston CMS <br />
      Version {{ version }}
    </p>
  </div>
</template>

<script setup>
const currentYear = new Date().getFullYear();
const version = "1.0.0";
</script>
