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
    <RowTable
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

// Compute Collection Name from Slug
const collectionName = computed(
  () =>
    collectionSlug.charAt(0).toUpperCase() +
    collectionSlug.slice(1).replace("-", " ")
);

// State and Store
const contentStore = useContentStore();
const isLoading = computed(() => contentStore.isLoading);
const error = computed(() => contentStore.error);
const fields = ref([]); // Fields for the item

// Fetch Item Data on Mount
onMounted(async () => {
  const item = await contentStore.fetchContentItem(collectionSlug, itemId);
  if (item) {
    fields.value = Object.entries(item.data).map(([key, value]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }));
  }
});

const enableEdit = (row) => {
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
