<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Collections</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center">Loading collections...</div>

    <!-- Error State -->
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- List of Collections -->
    <DataTable
      v-if="!isLoading && !error && collections.length"
      :data="collections"
      :columns="columns"
      :actionType="'view'"
      @view="handleOpenCollection"
    />

    <!-- Empty State -->
    <div
      v-else-if="!isLoading && !error && !collections.length"
      class="text-center"
    >
      No collections found.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useCollectionsStore } from "~/stores/collections";
import { useRouter } from "vue-router";

// Pinia Store
const collectionsStore = useCollectionsStore();

// Router for navigation
const router = useRouter();

// State
const isLoading = computed(() => collectionsStore.isLoading);
const error = computed(() => collectionsStore.error);
const collections = computed(() => collectionsStore.collections);

// Table Columns
const columns = [
  { key: "name", label: "Collection Name" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
  {
    key: "position",
    label: "Position",
    formatter: (value) => (value !== null ? value : "Not Set"),
  },
  {
    key: "is_hidden",
    label: "Hidden",
    formatter: (value) => (value ? "Yes" : "No"),
  },
  {
    key: "created_at",
    label: "Created At",
    formatter: (date) => new Date(date).toLocaleDateString(),
  },
];

// Fetch Collections on Mount
onMounted(async () => {
  await collectionsStore.fetchCollectionsForCurrentOrg();
});

// Handle Open Collection
const handleOpenCollection = (collection) => {
  console.log("Opening collection:", collection);
  router.push(`/collections/${collection.slug}`);
};
</script>
