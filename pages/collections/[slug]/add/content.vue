<template>
  <div class="px-6 py-4 space-y-6">
    <PageHeader :title="`Add Item to ${collectionName}`" />

    <div v-if="isLoading" class="text-center">Loading collection fields...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- No Fields Message -->
    <div v-if="!isLoading && !fields.length" class="text-center">
      <p class="text-gray-600 dark:text-gray-200">
        This collection currently has no fields.<br />
        You can add fields to this collection by clicking
        <a :href="editFieldsLink" class="text-violet-500 hover:underline"
          >here</a
        >.
      </p>
    </div>

    <BaseForm
      v-if="!isLoading && fields.length"
      :fields="fields"
      :editable="true"
      @submit="addContent"
      @cancel="cancelAdd"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useContentStore } from "~/stores/content";
import { useRoute, useRouter } from "vue-router";

import { useNotificationStore } from "@/stores/notification";
const notificationStore = useNotificationStore();

// Get Route Params
const route = useRoute();
const router = useRouter();
const collectionSlug = route.params.slug;
const collectionName = computed(
  () => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)
);

// State and Store
const contentStore = useContentStore();
const isLoading = computed(() => contentStore.isLoading);
const error = computed(() => contentStore.error);
const errors = ref({});

const allFields = computed(() => contentStore.fields[collectionSlug] || []);

const fields = ref([]);

// Map fields to their default values based on type
onMounted(async () => {
  await contentStore.fetchContentAndFields(collectionSlug);

  // Map fields with the content data
  fields.value = allFields.value.map((field) => ({
    key: field.key,
    label: field.label,
    type: field.type,
    value: "",
    options: field.options || [],
    isRequired: field.is_required,
    fullRow: ["textarea", "richtextmarkdown", "richtexthtml", "image"].includes(
      field.type
    ),
    halfRow: ["text", "select", "email"].includes(field.type),
    thirdRow: ["number", "date", "boolean"].includes(field.type),
  }));
});

const addContent = async () => {
  const dataToSubmit = fields.value.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  console.log("Form data ready for submission:", dataToSubmit);

  try {
    const success = await contentStore.addContentItem(
      collectionSlug,
      dataToSubmit
    );
    if (success) {
      notificationStore.showNotification(
        "success",
        "Item added successfully to the collection!"
      );
      router.push(`/collections/${collectionSlug}`);
    } else {
      errors.value.general = "Failed to add item. Please try again.";
    }
  } catch (err) {
    errors.value.general = "An unexpected error occurred. Please try again.";
    console.error("Error while adding item:", err);
  }
};

// Cancel Add
const cancelAdd = () => {
  router.push(`/collections/${collectionSlug}`);
};

// Edit Fields Link
const editFieldsLink = `/collections/${collectionSlug}/edit?collection=${collectionSlug}&edit=true`;
</script>
