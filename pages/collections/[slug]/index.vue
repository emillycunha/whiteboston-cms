<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      :title="`${collectionName}`"
      :buttons="[
        {
          label: 'Export Selected',
          icon: ArrowDownTrayIcon,
          iconPosition: 'after',
          variant: 'secondary',
          onClick: exportSelectedToCSV,
          disabled: selectedItems.length === 0,
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
    <div v-if="isLoading" class="text-center">Loading...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <!-- Reusable Table -->
    <DataTable
      v-else-if="!isLoading && !error && content.length"
      :data="content"
      :columns="fields"
      :enableCheckbox="true"
      :actionType="'view'"
      :rowsPerPage="10"
      @view="handleView"
      @selection-change="updateSelectedItems"
    />

    <!-- Empty State -->
    <div v-else class="text-center text-gray-600 dark:text-gray-300">
      <p>No data found for this collection.</p>
      <p>
        Add content by clicking
        <a :href="addContent" class="text-violet-500 hover:underline">here</a>
        or the "Add" button above.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useContentStore } from "~/stores/content";
import { useRoute } from "vue-router";
import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/vue/24/outline";

// Dynamic Route Params
const route = useRoute();
const collectionSlug = route.params.slug;
const collectionName = computed(
  () => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)
);

// Content Store
const contentStore = useContentStore();
const content = computed(() => contentStore.content);
const allFields = computed(() => contentStore.fields);
const isLoading = computed(() => contentStore.isLoading);
const error = computed(() => contentStore.error);

// Filter to get the top 3 fields based on their position
const fields = computed(() => {
  return allFields.value
    .filter((field) => typeof field.position === "number" && field.position > 0)
    .sort((a, b) => a.position - b.position)
    .slice(0, 3);
});

// Track selected items
const selectedItems = ref([]);

// Fetch Content and Fields on Mount
onMounted(async () => {
  await contentStore.fetchContentAndFields(collectionSlug);
});

// Handle Edit
const handleView = (row) => {
  console.log("Viewing row:", row);

  navigateTo({
    path: `/collections/${collectionSlug}/view/${row.id}`,
    query: {
      collection: collectionSlug,
    },
  });
};

// Update Selected Items
const updateSelectedItems = (items) => {
  selectedItems.value = items;
  console.log("Selected items:", selectedItems.value);
};

// Export Selected Items to CSV
const exportSelectedToCSV = () => {
  if (!selectedItems.value.length) return;

  const headers = fields.value.map((field) => field.label || field.key);
  const rows = selectedItems.value.map((id) => {
    const row = content.value.find((item) => item.id === id);
    return fields.value.map((field) => row[field.key] || "");
  });

  // Generate CSV Content
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Trigger Download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${collectionSlug}_selected.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log("Selected items exported to CSV.");
};

// Add New Item
const addNew = () => {
  navigateTo({
    path: `/collections/${collectionSlug}/add/content`,
    query: {
      collection: collectionSlug,
    },
  });
};

// Add Content Link
const addContent = `/collections/${collectionSlug}/add/content?collection=${collectionSlug}`;
</script>
