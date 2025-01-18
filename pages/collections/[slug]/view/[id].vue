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
const fields = ref([]); // Fields for the item

// Fetch Item Data on Mount
onMounted(async () => {
  try {
    // Fetch content and fields for the collection
    await contentStore.fetchContentAndFields(collectionSlug);

    // Fetch the specific content item
    const item = await contentStore.fetchContentItem(collectionSlug, itemId);
    if (!item) {
      throw new Error("Item not found");
    }
    console.log("[Debug] Item Loaded for Editing:", item);

    // Map fields with the content data
    fields.value = contentStore.fields.map((field) => ({
      key: field.key,
      label: field.label,
      type: field.type,
      value: item.data[field.key] || "",
      options: field.options || [],
      isRequired: field.is_required,
      fullRow:
        field.type === "textarea" ||
        field.type === "richtextmarkdown" ||
        field.type === "richtexthtml" ||
        field.type === "image",
    }));

    console.log("[Debug] Fields Loaded:", fields.value);
  } catch (err) {
    console.error("[Error Loading Fields]:", err);
  }
});

const enableEdit = () => {
  navigateTo({
    path: `/collections/${collectionSlug}/edit/${itemId}`,
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
