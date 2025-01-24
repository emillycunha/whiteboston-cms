<!-- 
  Developer Note:
  This page allows users to manage content, including:
  - Updating content (e.g., title, name, description).
-->
<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      :title="`Editing`"
      :buttons="[
        {
          label: 'Cancel',
          icon: XCircleIcon,
          iconPosition: 'before',
          variant: 'secondary',
          onClick: cancelEdit,
        },
        {
          label: 'Save',
          icon: CheckCircleIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: saveChanges,
        },
      ]"
    />

    <div v-if="isLoading" class="text-center">Loading item...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- Custom Form -->
    <BaseForm
      v-if="!isLoading && !error && fields.length"
      :fields="fields"
      :editable="true"
      @submit="saveChanges"
      @cancel="cancelEdit"
    />

    <div v-else-if="!isLoading && !error">No data found for this item.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useContentStore } from "~/stores/content";
import { useRoute, useRouter } from "vue-router";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

// Get Route Params
const route = useRoute();
const router = useRouter();
const collectionSlug = route.params.slug;
const itemId = route.params.id;

// State and Store
const contentStore = useContentStore();
const isLoading = computed(() => contentStore.isLoading);
const error = computed(() => contentStore.error);

const allFields = computed(() => contentStore.fields[collectionSlug] || []);
const content = computed(() => contentStore.content[collectionSlug] || []);

const fields = ref([]);

// Fetch Item Data on Mount
onMounted(async () => {
  try {
    // Fetch content and fields for the collection
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

const cancelEdit = () => {
  navigateTo({
    path: `/collections/${collectionSlug}/view/${itemId}`,
    query: {
      collection: collectionSlug,
      edit: "false",
    },
  });
};

// Save Changes
const saveChanges = async () => {
  // Prepare updated data from fields
  const updatedData = fields.value.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  try {
    // Update content item
    const success = await contentStore.updateContentItem(
      collectionSlug,
      itemId,
      updatedData
    );

    if (success) {
      router.push(`/collections/${collectionSlug}/view/${itemId}`);
    } else {
      console.error("Failed to save changes.");
    }
  } catch (err) {
    console.error("Error saving changes:", err);
  }
};
</script>
