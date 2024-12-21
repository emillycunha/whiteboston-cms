<template>
  <header
    class="flex flex-col md:flex-row md:items-center md:justify-between mb-4"
  >
    <!-- Title -->
    <div>
      <h1
        class="text-2xl font-semibold text-gray-800 dark:text-white sm:text-4xl"
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
        :disabled="button.disabled"
        :class="[
          'flex items-center justify-between py-2 px-4 text-sm font-medium rounded-lg shadow-sm',
          button.variant === 'primary'
            ? 'text-white bg-violet-500 hover:bg-violet-600 dark:bg-teal-500 dark:hover:bg-teal-600'
            : 'text-gray-700 bg-white border border-gray-400 hover:bg-gray-50 dark:bg-slate-500 dark:text-white dark:border-slate-500 dark:hover:bg-gray-600 dark:hover:border-slate-600',
          button.disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
      >
        <!-- Icon Before -->
        <component
          :is="button.icon"
          class="mr-2 size-5"
          v-if="button.icon && button.iconPosition === 'before'"
        /><span class=""> {{ button.label }}</span>
        <!-- Icon After -->
        <component
          :is="button.icon"
          class="ml-2 size-5"
          v-if="button.icon && button.iconPosition === 'after'"
        />
      </button>
    </div>
  </header>
</template>

<script setup>
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
