<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      title="Collections"
      :buttons="[
        {
          label: 'Settings',
          icon: Cog6ToothIcon,
          iconPosition: 'after',
          variant: 'secondary',
          onClick: navigateToSettings,
        },
        {
          label: 'Add Collection',
          icon: PlusIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: navigateToAddNewCollection,
        },
      ]"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center">Loading...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <!-- List of Collections -->
    <DataTable
      v-else-if="!isLoading && !error && collections.length"
      :data="collections"
      :columns="columns"
      :rowsPerPage="5"
      :actionType="'both'"
      @view="handleView"
      @edit="handleEdit"
    />

    <!-- No Collections Note -->
    <div
      v-else
      class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700"
    >
      <div
        class="mt-4 p-4 rounded-md text-center text-gray-600 dark:text-gray-300"
      >
        <p>No collections available.</p>
        <p>Click the "Add" button to create a new collection.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useCollectionsStore } from "~/stores/collections";
import { Cog6ToothIcon, PlusIcon } from "@heroicons/vue/24/outline";

const collectionsStore = useCollectionsStore();

const isLoading = computed(() => collectionsStore.isLoading);
const error = computed(() => collectionsStore.error);
const collections = computed(() => collectionsStore.collections);

const columns = [
  { key: "name", label: "Collection Name" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
  { key: "position", label: "Position" },
  { key: "is_hidden", label: "Hidden?" },
];

onMounted(async () => {
  await collectionsStore.fetchCollectionsForCurrentOrg();
});

const handleView = (collection) => {
  navigateTo({
    path: `/collections/${collection.slug}`,
    query: {
      collectionId: collection.id,
      collectionSlug: collection.slug,
      collectionName: collection.name,
    },
  });
};

const handleEdit = (collection) => {
  navigateTo({
    path: `/collections/${collection.slug}/edit/${collection.id}/collections`,
    query: {
      collectionId: collection.id,
      collectionSlug: collection.slug,
      edit: "true",
    },
  });
};

const navigateToAddNewCollection = () => {
  navigateTo({ path: `/collections/new/add/collection` });
};

const navigateToSettings = () => {
  navigateTo({ path: "/settings" });
};
</script>
