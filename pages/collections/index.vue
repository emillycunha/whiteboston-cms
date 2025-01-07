<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      title="Collections"
      :buttons="[
        {
          label: 'Reorder',
          icon: ArrowDownTrayIcon,
          iconPosition: 'after',
          variant: 'secondary',
          onClick: addNew,
        },
        {
          label: 'Add',
          icon: PlusIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: addNew,
        },
      ]"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center">Loading collections...</div>

    <!-- Error State -->
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- List of Collections -->
    <DataTable
      v-if="!isLoading && !error && collections.length"
      :data="collections"
      :columns="columns"
      :actionType="'both'"
      @view="handleView"
      @edit="handleEdit"
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
import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/vue/24/outline";

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
  { key: "position", label: "Position" },
  { key: "is_hidden", label: "Hidden?" },
];

// Fetch Collections on Mount
onMounted(async () => {
  await collectionsStore.fetchCollectionsForCurrentOrg();
});

// Handle Open Collection
const handleView = (collection) => {
  navigateTo({
    path: `/collections/${collection.slug}`,
    query: {
      collection: collection.name,
    },
  });
};

const handleEdit = (collection) => {
  navigateTo({
    path: `/collections/${collection.slug}/edit`,
    query: {
      collection: collection.name,
      edit: "true",
    },
  });
};

const addNew = () => {
  navigateTo({ path: `/collections/new/add/collections` });
};
</script>
