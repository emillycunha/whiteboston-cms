<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Add New Collection" />

    <!-- Add Collection Form -->
    <BaseForm
      :fields="fields"
      :editable="true"
      @submit="addCollection"
      @cancel="cancelAdd"
    />

    <!-- Error State -->
    <div v-if="errors.length" class="mt-4 p-2 text-red-500 text-sm">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

import { useNotificationStore } from "@/stores/notification";
import { useCollectionsStore } from "@/stores/collections";
import { usePredefinedCollectionsStore } from "@/stores/collectionTemplates";
import { useFieldsStore } from "@/stores/fields";

const notificationStore = useNotificationStore();
const collectionsStore = useCollectionsStore();
const predefinedCollectionsStore = usePredefinedCollectionsStore();
const fieldsStore = useFieldsStore();

const errors = ref([]);

const fields = ref([
  {
    key: "name",
    label: "Collection Name",
    type: "text",
    value: "",
    isRequired: true,
  },
  {
    key: "slug",
    label: "Slug",
    type: "text",
    value: "",
    isRequired: true,
  },
  {
    key: "position",
    label: "Position",
    type: "number",
    value: 0,
    isRequired: false,
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    fullRow: true,
    value: "",
    isRequired: false,
  },

  {
    key: "is_hidden",
    label: "Hidden",
    type: "boolean",
    value: false,
    isRequired: false,
  },
]);

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

watch(
  () => fields.value.find((f) => f.key === "name").value,
  (newName) => {
    if (newName) {
      // Update the slug field in fields.value
      const slugField = fields.value.find((f) => f.key === "slug");
      slugField.value = slugify(newName);
    }
  }
);

onMounted(() => {
  predefinedCollectionsStore.initializeCollections();
});

// Add New Collection
const addCollection = async () => {
  errors.value = [];

  try {
    const existingSlug = await collectionsStore.checkSlugExists(
      fields.value.find((f) => f.key === "slug").value
    );
    if (existingSlug) {
      errors.value.push(
        "Collection slug already exists. Please use a unique slug."
      );
      return;
    }

    const dataToSubmit = prepareDataForSubmission(fields.value);
    const success = await collectionsStore.addCollection(dataToSubmit);

    if (success) {
      const newSlug = fields.value.find((f) => f.key === "slug").value;
      handleCollectionSuccess(newSlug);
    } else {
      errors.value.push("Failed to add collection. Please try again.");
    }
  } catch (err) {
    errors.value.push("An unexpected error occurred. Please try again.");
  }
};

const prepareDataForSubmission = (fields) => {
  return fields.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});
};

const handleCollectionSuccess = async (newSlug) => {
  notificationStore.showNotification(
    "success",
    "Collection added successfully!"
  );

  const predefinedFields =
    predefinedCollectionsStore.getFieldsForCollection(newSlug);

  if (predefinedFields.length > 0) {
    await addPredefinedFields(newSlug, predefinedFields);
  } else {
    console.log(
      `[Debug] No predefined fields found for collection "${newSlug}"`
    );
  }

  collectionsStore.clearCollectionCache();
  await collectionRedirect(newSlug);
};

const addPredefinedFields = async (newSlug, predefinedFields) => {
  const fieldAddSuccess = await fieldsStore.addNewCollectionFields(
    newSlug,
    predefinedFields
  );

  if (fieldAddSuccess) {
    console.log(
      `[Debug] Predefined fields successfully added to collection "${newSlug}"`
    );
  } else {
    console.error(
      `[Error] Failed to add predefined fields to collection "${newSlug}"`
    );
  }
};

const collectionRedirect = (newSlug) => {
  navigateTo({
    path: `/collections/${newSlug}/add/fields`,
    query: {
      collection: newSlug,
    },
  });
};

// Cancel Add
const cancelAdd = () => {
  navigateTo({
    path: `/collections/`,
  });
};
</script>
