<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader
      :title="`Editing: ${collectionName}`"
      :buttons="[
        {
          label: 'Settings',
          icon: Cog6ToothIcon,
          iconPosition: 'after',
          variant: 'secondary',
          requiredRole: ['admin', ''],
          onClick: navigateToSettings,
        },
        {
          label: 'Add Fields',
          icon: PlusIcon,
          iconPosition: 'after',
          variant: 'primary',
          requiredRole: ['admin', ''],
          onClick: addFields,
        },
      ]"
    />

    <div v-if="isLoading" class="text-center">Loading collection fields...</div>
    <div v-if="errors" class="text-red-500">{{ errors }}</div>

    <BaseForm
      :fields="fields"
      :editable="editable"
      @submit="saveChanges"
      @cancel="cancelChanges"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PlusIcon, Cog6ToothIcon } from "@heroicons/vue/24/outline";

const notificationStore = useNotificationStore();

// Route and Router
const route = useRoute();
const router = useRouter();
const collectionSlug = route.query.collectionSlug;
const collectionId = route.query.collectionId;

// State and Store
const collectionsStore = useCollectionsStore();
const collection = ref({
  name: "",
  slug: "",
  description: "",
  is_hidden: false,
  position: 0,
});

const isLoading = computed(() => collectionsStore.isLoading);
const errors = ref();
const collectionName = computed(
  () => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)
);

const fields = ref([]);
let originalSlug = "";
const editable = ref(true);

onMounted(async () => {
  try {
    const collectionData = await collectionsStore.fetchCollectionById(
      collectionId
    );

    if (collectionData) {
      const editableFields = [
        { key: "name", label: "Name", type: "text", isRequired: true },
        { key: "slug", label: "Slug", type: "text", isRequired: true },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          fullRow: true,
          isRequired: true,
        },

        {
          key: "position",
          label: "Position",
          type: "number",
          isRequired: false,
        },
        {
          key: "is_hidden",
          label: "Hidden",
          type: "boolean",
          isRequired: false,
        },
      ];

      fields.value = editableFields.map((field) => ({
        ...field,
        value:
          collectionData[field.key] !== undefined
            ? collectionData[field.key]
            : "",
      }));
    }
  } catch (err) {
    console.error("[Error Loading Collection]:", err);
  }
});

const saveChanges = async () => {
  errors.value = "";

  if (collection.value.slug !== originalSlug) {
    const slugExists = await collectionsStore.checkSlugExists(
      collection.value.slug
    );
    if (slugExists) {
      errors.value =
        "The slug is already in use by another collection. Please choose a different one.";
      notificationStore.showNotification("error", errors.value);
      return;
    }
  }

  try {
    let messages = [];

    const { error: metadataError } = await collectionsStore.updateCollection({
      id: collection.value.id,
      name: collection.value.name,
      slug: collection.value.slug,
      description: collection.value.description,
      is_hidden: collection.value.is_hidden,
      position: collection.value.position,
    });

    if (metadataError) throw metadataError;
    messages.push("Collection metadata updated successfully.");

    const finalMessage = messages.length
      ? messages.join(" ")
      : "Collection updated successfully.";
    notificationStore.showNotification("success", finalMessage);

    router.push(`/collections`);
  } catch (err) {
    console.error("Error updating collection:", err);

    errors.value = "Failed to save the collection. Please try again later.";
    notificationStore.showNotification("error", errors.value);
  }
};

const cancelChanges = () => {
  navigateTo({
    path: `/collections`,
  });
};

const addFields = () => {
  navigateTo({
    path: `/collections/${collectionSlug}/add/fields`,
  });
};

const navigateToSettings = () => {
  navigateTo({ path: "/settings" });
};
</script>
