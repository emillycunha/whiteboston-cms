<template>
  <header
    class="flex flex-col md:flex-row md:items-center md:justify-between mb-4"
  >
    <!-- Title -->
    <div>
      <h1
        class="text-1xl font-semibold text-gray-800 dark:text-white sm:text-4xl mb-2"
      >
        {{ title }}
      </h1>
    </div>

    <!-- Buttons -->
    <div v-if="filteredButtons.length > 0" class="flex gap-3">
      <button
        v-for="(button, index) in filteredButtons"
        :key="index"
        :disabled="button.disabled"
        :class="[
          'flex items-center justify-between py-2 px-4 text-sm font-medium rounded-lg shadow-sm',
          button.variant === 'primary'
            ? 'text-white bg-violet-500 hover:bg-violet-600 dark:bg-teal-500 dark:hover:bg-teal-600'
            : 'text-gray-700 bg-white border border-gray-400 hover:bg-gray-50 dark:bg-slate-500 dark:text-white dark:border-slate-500 dark:hover:bg-gray-600 dark:hover:border-slate-600',
          button.disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        @click="() => button.onClick && button.onClick()"
      >
        <!-- Icon Before -->
        <component
          :is="button.icon"
          v-if="button.icon && button.iconPosition === 'before'"
          class="mr-2 size-5"
        /><span class=""> {{ button.label }}</span>
        <!-- Icon After -->
        <component
          :is="button.icon"
          v-if="button.icon && button.iconPosition === 'after'"
          class="ml-2 size-5"
        />
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";

const { buttons, title } = defineProps({
  title: {
    type: String,
    required: true,
  },
  buttons: {
    type: Array,
    default: () => [],
  },
});

const authStore = useAuthStore();
const userRole = computed(() => authStore.role);

const filteredButtons = computed(() => {
  if (!Array.isArray(buttons)) {
    console.warn("Buttons prop is not an array:", buttons);
    return [];
  }

  const result = buttons.filter(
    (button) =>
      !button.requiredRole || button.requiredRole.includes(userRole.value)
  );

  return result;
});
</script>
