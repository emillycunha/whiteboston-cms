<template>
  <div class="px-1 md:px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader :title="`Editing`" />

    <div v-if="isLoading" class="text-center">Loading item...</div>
    <div v-if="errors" class="text-red-500">{{ errors }}</div>

    <!-- Custom Form -->
    <BaseForm v-if="!isLoading && fields.length" :fields="fields" :editable="editable" @submit="saveChanges" @cancel="cancelEdit" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useContentStore } from "~/stores/content";
import { useRoute, useRouter } from "vue-router";

// Get Route Params
const route = useRoute();
const router = useRouter();
const collectionSlug = route.params.slug;
const itemId = route.params.id;

const notificationStore = useNotificationStore();

// State and Store
const contentStore = useContentStore();
const isLoading = computed(() => contentStore.isLoading);

const editable = ref(true);
const allFields = computed(() => contentStore.fields[collectionSlug] || []);
const content = computed(() => contentStore.content[collectionSlug] || []);

const fields = ref([]);
const errors = ref("");

onMounted(async () => {
  try {
    await contentStore.fetchContentAndFields(collectionSlug);

    const item = content.value.find((entry) => entry.id === parseInt(itemId, 10));
    if (!item) {
      throw new Error("Item not found");
    }

    fields.value = allFields.value.map((field) => ({
      key: field.key,
      label: field.label,
      type: field.type,
      value: item.data[field.key] || "",
      options: field.options || [],
      isRequired: field.is_required,
      fullRow: ["textarea", "richtextmarkdown", "richtexthtml", "image"].includes(field.type),
      halfRow: ["text", "select", "email"].includes(field.type),
      thirdRow: ["number", "date", "boolean"].includes(field.type),
    }));
    errors.value = "";
  } catch (err) {
    console.error("[Error Loading Fields]:", err);
    errors.value = err.message;
  }
});

const saveChanges = async () => {
  const updatedData = fields.value.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  try {
    notificationStore.showNotification("info", "Saving changes, please wait...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    router.push(`/collections/${collectionSlug}/view/${itemId}/content`);

    await contentStore.updateContentItem(collectionSlug, itemId, updatedData);
  } catch (err) {
    console.error("Error saving changes:", err);
  }
};

const cancelEdit = () => {
  navigateTo({
    path: `/collections/${collectionSlug}/view/${itemId}/content`,
    query: {
      collection: collectionSlug,
      edit: "false",
    },
  });
};
</script>
