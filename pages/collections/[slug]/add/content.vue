<template>
  <div class="px-6 py-4 space-y-6">
    <PageHeader :title="`Add Item to ${collectionName}`" />

    <div v-if="isLoading" class="text-center">Loading collection fields...</div>
    <div v-if="errors" class="text-red-500">{{ errors }}</div>

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
      @cancel="goBack"
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
const errors = ref("");

const allFields = computed(() => contentStore.fields[collectionSlug] || []);

const fields = ref([]);

onMounted(async () => {
  await contentStore.fetchContentAndFields(collectionSlug);

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

  try {
    notificationStore.showNotification(
      "info",
      "Adding content, please wait..."
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push(`/collections/${collectionSlug}`);

    await contentStore.addContentItem(collectionSlug, dataToSubmit);
  } catch (err) {
    console.error("Error adding content:", err);
  }
};

const goBack = () => {
  router.push(`/collections/${collectionSlug}`);
};

const editFieldsLink = `/collections/${collectionSlug}/edit?collection=${collectionSlug}&edit=true`;
</script>
