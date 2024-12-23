<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader :title="`Editing`" />

    <div v-if="isLoading" class="text-center">Loading item...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- Reusable Form to Edit Item -->
    <RowTable
      v-if="!isLoading && !error && fields.length"
      :fields="fields"
      :editable="true"
    />

    <PageFooter
      title=""
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

// Save Changes
const saveChanges = async () => {
  const updatedData = fields.value.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  const success = await contentStore.updateContentItem(
    collectionSlug,
    itemId,
    updatedData
  );
  if (success) {
    router.push(`/collections/${collectionSlug}`);
  }
};

const cancelEdit = () => {
  navigateTo({
    path: `/collections/${collectionSlug}/view/${itemId}`,
  });
};
</script>
