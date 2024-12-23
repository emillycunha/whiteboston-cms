<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth"; // Import your Auth Store

// Define refs with explicit types to fix type mismatch
const userPreferences = ref<Record<string, any>>({});
const userRole = ref<string | null>(null);
const orgId = ref<string | null>(null);
const fetchError = ref<string | null>(null);

// Fetch data on component mount
onMounted(async () => {
  const authStore = useAuthStore();

  try {
    // Initialize the Auth session
    await authStore.initializeAuthSession();

    // Fetch and display user data
    userPreferences.value = authStore.preferences;
    userRole.value = authStore.role;
    orgId.value = authStore.org_id;
  } catch (err) {
    console.error("[Debug Page] Failed to fetch data:", err);
    fetchError.value = "Failed to fetch data. See console for details.";
  }
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Debug Page</h1>

    <!-- Display error if any -->
    <div v-if="fetchError" class="text-red-500">
      {{ fetchError }}
    </div>

    <!-- Display fetched data -->
    <div v-else>
      <h2 class="mt-4 text-xl font-semibold">User Preferences</h2>
      <pre class="bg-gray-100 p-4 rounded border">{{ userPreferences }}</pre>

      <h2 class="mt-4 text-xl font-semibold">User Role</h2>
      <p class="bg-gray-100 p-4 rounded border">{{ userRole }}</p>

      <h2 class="mt-4 text-xl font-semibold">Organization ID</h2>
      <p class="bg-gray-100 p-4 rounded border">{{ orgId }}</p>
    </div>
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
}
</style>
