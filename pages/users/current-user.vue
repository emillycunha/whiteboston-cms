<template>
  <div>
    <!-- Current Role -->
    <p>
      Current Role: <strong>{{ role }}</strong>
    </p>

    <!-- List of Permissions -->
    <h3>Your Permissions:</h3>
    <ul>
      <li v-for="(allowed, action) in rolePermissions" :key="action">
        <strong>{{ action }}</strong
        >: {{ allowed ? "Allowed" : "Denied" }}
      </li>
    </ul>

    <!-- Add Collection Button -->
    <button
      v-if="permissionsStore.hasPermission('canAddCollections')"
      @click="addCollection"
    >
      Add Collection
    </button>
    <p v-else>You do not have permission to add collections.</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMyPermissionsStore, permissions } from "~/stores/permissions";

const permissionsStore = useMyPermissionsStore();

// Get the current role
const role = computed(() => permissionsStore.role || "No Role Assigned");

// Get the permissions for the current role
const rolePermissions = computed(() => {
  return permissionsStore.role ? permissions[permissionsStore.role] : {};
});

// Function to handle adding a collection
const addCollection = () => {
  console.log("Adding a new collection...");
};
</script>
