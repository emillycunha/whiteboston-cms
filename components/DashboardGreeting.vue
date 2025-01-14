<template>
  <h2 class="text-gray-700 text-xl">
    {{ greeting }},
    <span v-if="isHydrated">{{ name }}</span>
    <span v-else></span>
  </h2>
  <p class="text-teal-500 text-sm mt-1">{{ formattedDate }}</p>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

// Reactive state
const authStore = useAuthStore();
const isHydrated = ref(false);

// Dynamic greeting
const hours = ref(new Date().getHours());
const greeting = computed(() => {
  if (hours.value < 12) return "Good morning";
  if (hours.value < 18) return "Good afternoon";
  return "Good evening";
});

// Format today's date
const serverDate = new Date();
const formattedDate = computed(() => {
  return serverDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});

// Fetch name client-side
const name = computed(() => authStore.name || "Guest");

onMounted(() => {
  isHydrated.value = true;
  hours.value = new Date().getHours();
});
</script>
