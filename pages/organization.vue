<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      title="Organizations"
      :buttons="[
        {
          label: 'Settings',
          icon: Cog6ToothIcon,
          iconPosition: 'after',
          variant: 'secondary',
          onClick: goToSettings,
        },
        {
          label: 'Add User',
          icon: PlusIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: addNew,
        },
      ]"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center">Loading users...</div>

    <!-- Error State -->
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- List of Users -->
    <DataTable
      v-if="!isLoading && !error && users.length"
      :data="users"
      :columns="columns"
      :rowsPerPage="5"
      :actionType="'both'"
      @view="handleView"
      @edit="handleEdit"
    />

    <!-- Empty State -->
    <div v-else-if="!isLoading && !error && !users.length" class="text-center">
      No users found.
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useUsersStore } from "~/stores/admin.ts";
import { Cog6ToothIcon, PlusIcon } from "@heroicons/vue/24/outline";

// Pinia Store
const usersStore = useUsersStore();

// State
const isLoading = computed(() => usersStore.isLoading);
const error = computed(() => usersStore.error);
const users = computed(() => usersStore.users);

// Table Columns
const columns = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
];

// Fetch Collections on Mount
onMounted(async () => {
  await usersStore.fetchOrgUsers();
  console.log(users.value);
});

const handleView = (row) => {
  navigateTo({
    path: `/users/${row.id}/`,
    query: {
      edit: "false",
    },
  });
};

const handleEdit = (row) => {
  navigateTo({
    path: `/users/${row.id}/`,
    query: {
      edit: "true",
    },
  });
};

const addNew = () => {
  navigateTo({ path: `/collections/new/add/collection` });
};

const goToSettings = () => {
  navigateTo({ path: "/settings" });
};
</script>
