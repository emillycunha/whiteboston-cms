<template>
  <div class="px-1 md:px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      :title="`${collectionName}`"
      :buttons="[
        {
          label: 'Export Selected',
          icon: ArrowDownTrayIcon,
          iconPosition: 'after',
          variant: 'secondary',
          requiredRole: ['admin', 'editor'],
          onClick: exportSelectedToCSV,
          disabled: selectedItems.length === 0,
        },
        {
          label: 'Add Content',
          icon: PlusIcon,
          iconPosition: 'after',
          variant: 'primary',
          requiredRole: ['admin', 'editor'],
          onClick: addNew,
        },
      ]"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center">Loading...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <!-- Reusable Table -->
    <DataTable v-else-if="!isLoading && !error && content.length" :data="tableData" :columns="fields" :enableCheckbox="true" :actionType="'both'" :rowsPerPage="10" @view="handleView" @edit="handleEdit" @selection-change="updateSelectedItems" />

    <!-- Empty State -->
    <div v-else class="text-center text-gray-700 dark:text-gray-300">
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
const collectionName = computed(() => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1));

// Content Store
const contentStore = useContentStore();
const content = computed(() => {
  const result = contentStore.content[collectionSlug] || [];
  return result;
});
const allFields = computed(() => {
  const result = contentStore.fields[collectionSlug] || [];
  return result;
});

const tableData = computed(() => {
  return content.value.map((item) => ({
    ...item.data,
    id: item.id,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
});

const isLoading = computed(() => contentStore.isLoading);
const error = computed(() => contentStore.error);

const selectedItems = ref([]);

const fields = computed(() => {
  return allFields.value
    .filter((field) => typeof field.position === "number" && field.position >= 0)
    .sort((a, b) => a.position - b.position)
    .slice(0, 4);
});

onMounted(async () => {
  try {
    if (collectionSlug) {
      if (!contentStore.content[collectionSlug]) {
        console.log("[Content Page] Fetching content and fields...");
        await contentStore.fetchContentAndFields(collectionSlug);
        console.log(`[Content Page] Content and Fields loaded for: ${collectionSlug}`);
      } else {
        console.log("[Content Page] Using cached content for:", collectionSlug);
      }

      const cachedContent = contentStore.content[collectionSlug] || [];
      const cachedFields = contentStore.fields[collectionSlug] || [];

      console.log(`[Content Page] Final content after mount:`, cachedContent);
      console.log(`[Content Page] Final fields after mount:`, cachedFields);
    } else {
      console.warn("[Content Page] Collection slug not found.");
    }
  } catch (error) {
    console.error("[Content Page] Error fetching content and fields:", error);
  }
});

const handleView = (row) => {
  navigateTo({
    path: `/collections/${collectionSlug}/view/${row.id}/content`,
    query: {
      collection: collectionSlug,
    },
  });
};

const handleEdit = (row) => {
  navigateTo({
    path: `/collections/${collectionSlug}/edit/${row.id}/content`,
    query: {
      collection: collectionSlug,
      edit: "true",
    },
  });
};

const updateSelectedItems = (items) => {
  selectedItems.value = items;
  console.log("Selected items:", selectedItems.value);
};

const exportSelectedToCSV = () => {
  if (!selectedItems.value.length) return;

  // Headers: Include all fields, not just the ones displayed
  const headers = allFields.value
    .filter((field) => typeof field.position === "number" && field.position > 0)
    .sort((a, b) => a.position - b.position)
    .map((field) => field.label || field.key); // Get labels or keys for headers

  // Rows: Get data for the selected items based on all fields
  const rows = selectedItems.value.map((id) => {
    const row = content.value.find((item) => item.id === id);
    return allFields.value.map((field) => row[field.key] || ""); // Include all fields in content
  });

  // Generate CSV Content
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

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

const addNew = () => {
  navigateTo({
    path: `/collections/${collectionSlug}/add/content`,
    query: {
      collection: collectionSlug,
    },
  });
};

const addContent = `/collections/${collectionSlug}/add/content?collection=${collectionSlug}`;
</script>
