<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

// Fetch user metadata and log details on page load
onMounted(async () => {
  console.log("[Test Page] Auth Store State:", authStore.$state);

  if (authStore.isAuthenticated) {
    console.log("[Test Page] Fetching user metadata...");
    await authStore.fetchUserMetadata();
    console.log("[Test Page] User Metadata:", {
      id: authStore.id,
      email: authStore.email,
      role: authStore.role,
      darkmode: authStore.darkmode,
      org_id: authStore.org_id,
    });
  } else {
    console.warn("[Test Page] User is not authenticated.");
  }
});
</script>

<template>
  <div>
    <h1>Test Page</h1>
    <p>User ID: {{ authStore.id }}</p>
    <p>Email: {{ authStore.email }}</p>
    <p>Role: {{ authStore.role }}</p>
    <p>Dark Mode: {{ authStore.darkmode ? "Enabled" : "Disabled" }}</p>
    <p>Organization ID: {{ authStore.org_id }}</p>
    <p>Authenticated: {{ authStore.isAuthenticated ? "Yes" : "No" }}</p>
  </div>
</template>
