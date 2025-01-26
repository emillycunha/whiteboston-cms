<template>
  <div class="px-6 py-4 space-y-6">
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
          requiredRole: ['admin', 'editor'],
          onClick: enableEdit,
        },
      ]"
    />

    <div v-if="isLoading" class="text-center">Loading item...</div>
    <div v-if="errors" class="text-red-500">{{ errors }}</div>

    <!-- Reusable Form to View Item -->
    <BaseForm
      v-if="!isLoading && !error && fields.length"
      :fields="fields"
      :editable="false"
    />
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

// Computed Fields for the Collection
const allFields = computed(() => contentStore.fields[collectionSlug] || []);
const content = computed(() => contentStore.content[collectionSlug] || []);

const fields = ref([]);
const errors = ref("");

onMounted(async () => {
  try {
    await contentStore.fetchContentAndFields(collectionSlug);

    const item = content.value.find(
      (entry) => entry.id === parseInt(itemId, 10)
    );
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
      fullRow: [
        "textarea",
        "richtextmarkdown",
        "richtexthtml",
        "image",
      ].includes(field.type),
      halfRow: ["text", "select", "email"].includes(field.type),
      thirdRow: ["number", "date", "boolean"].includes(field.type),
    }));
    errors.value = "";
  } catch (err) {
    console.error("[Error Loading Fields]:", err);
    errors.value = err.message;
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
