<template>
  <header
    class="flex flex-col-reverse md:flex-row md:items-center md:justify-between mb-6"
  >
    <!-- Title -->
    <div>
      <h1
        class="text-xl font-semibold text-gray-800 dark:text-gray-100 sm:text-2xl"
      >
        {{ title }}
      </h1>
    </div>

    <!-- Buttons -->
    <div class="flex gap-3" v-if="buttons.length > 0">
      <button
        v-for="(button, index) in buttons"
        :key="index"
        @click="() => button.onClick && button.onClick()"
        :class="[
          'flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm',
          button.variant === 'primary'
            ? 'text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600'
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
        ]"
      >
        <component :is="button.icon" class="mr-2 w-5 h-5" v-if="button.icon" />
        {{ button.label }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { defineProps } from "vue";

// Props for the component
defineProps({
  title: {
    type: String,
    required: true,
  },
  buttons: {
    type: Array,
    default: () => [],
  },
});
</script>
