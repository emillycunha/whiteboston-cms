<!-- 
  Developer Note:
  This page allows users to view content.
-->
<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      :title="`Viewing Details`"
      :buttons="[
        {
          label: 'Back',
          icon: ChevronLeftIcon,
          iconPosition: 'before',
          variant: 'secondary',
          onClick: goBack,
        },
        {
          label: 'Edit',
          icon: PencilSquareIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: enableEdit,
        },
      ]"
    />

    <div v-if="isLoading" class="text-center">Loading item...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- Reusable Form to View Item -->
    <BaseForm
      v-if="!isLoading && !error && fields.length"
      :fields="fields"
      :editable="false"
    />

    <div v-else-if="!isLoading && !error">No data found for this item.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useContentStore } from "~/stores/content";
import { useRoute } from "vue-router";
import { ChevronLeftIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";

// Get Route Params
const route = useRoute();
const collectionSlug = route.params.slug;
const itemId = route.params.id;

// State and Store
const contentStore = useContentStore();
const isLoading = computed(() => contentStore.isLoading);
const error = computed(() => contentStore.error);

// Computed Fields for the Collection
const allFields = computed(() => contentStore.fields[collectionSlug] || []);
const content = computed(() => contentStore.content[collectionSlug] || []);

const fields = ref([]);

// Fetch Item Data on Mount
onMounted(async () => {
  try {
    console.log(
      `[View Page] Fetching content and fields for collection slug: ${collectionSlug}`
    );

    // Fetch content and fields for the collection
    await contentStore.fetchContentAndFields(collectionSlug);

    // Find the specific item in content
    const item = content.value.find(
      (entry) => entry.id === parseInt(itemId, 10)
    );
    if (!item) {
      throw new Error("Item not found");
    }
    console.log("[Debug] Item Loaded for Viewing:", item);

    // Map fields with the content data
    fields.value = allFields.value.map((field) => ({
      key: field.key,
      label: field.label,
      type: field.type,
      value: item.data[field.key] || "",
      options: field.options || [],
      isRequired: field.is_required,
      fullRow: [
        "textarea",
        "richtextmarkdown",
        "richtexthtml",
        "image",
      ].includes(field.type),
      halfRow: ["text", "select", "email"].includes(field.type),
      thirdRow: ["number", "date", "boolean"].includes(field.type),
    }));

    console.log("[Debug] Fields Loaded:", fields.value);
  } catch (err) {
    console.error("[Error Loading Fields]:", err);
  }
});

const enableEdit = () => {
  navigateTo({
    path: `/collections/${collectionSlug}/edit/${itemId}/content`,
    query: {
      collection: collectionSlug,
      edit: "true",
    },
  });
};

const goBack = () => {
  navigateTo({
    path: `/collections/${collectionSlug}`,
  });
};
</script>
