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
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/stores/notification";
import { useCollectionsStore } from "@/stores/collections";
import { useAuthStore } from "@/stores/auth";
import BaseForm from "@/components/BaseForm.vue";

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const collectionsStore = useCollectionsStore();
const router = useRouter();

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
    key: "description",
    label: "Description",
    type: "textarea",
    fullRow: true,
    value: "",
    isRequired: false,
  },
  {
    key: "position",
    label: "Position",
    type: "number",
    value: 0,
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

// Slugify Helper
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

// Watch for name input to auto-generate slug
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

// Add New Collection
const addCollection = async () => {
  // Check if the user has the required permission
  if (!authStore.canAddCollections) {
    console.error(
      "[Save Changes] User does not have permission to add collections."
    );

    // Show error notification
    notificationStore.showNotification(
      "error",
      "You do not have permission to add collections."
    );

    return; // Exit early
  }

  try {
    // Debugging: Log the fields value
    console.log("Fields before submission:", fields.value);

    // Check if the slug already exists
    const existingSlug = await collectionsStore.checkSlugExists(
      fields.value.find((f) => f.key === "slug").value
    );
    if (existingSlug) {
      notificationStore.showNotification(
        "error",
        "Collection slug already exists. Please use a unique slug."
      );
      return;
    }

    // Prepare data for submission
    const dataToSubmit = fields.value.reduce((acc, field) => {
      acc[field.key] = field.value;
      return acc;
    }, {});

    // Debugging: Log the prepared data for submission
    console.log("Data prepared for submission:", dataToSubmit);

    // Add the collection
    const success = await collectionsStore.addCollection(dataToSubmit);

    if (success) {
      // Show success notification
      notificationStore.showNotification(
        "success",
        "Collection added successfully!"
      );

      // Clear the cache and reload the collections after redirect
      collectionsStore.clearCollections();

      // Redirect to the new collection's edit page
      const newSlug = fields.value.find((f) => f.key === "slug").value;
      await router.push(`/collections/${newSlug}/add/fields`);
    } else {
      console.error("Failed to add collection:", collectionsStore.error);
    }
  } catch (err) {
    notificationStore.showNotification(
      "error",
      "An unexpected error occurred. Please try again."
    );
    console.error("Add Collection Error:", err);
  }
};

// Cancel Add
const cancelAdd = () => {
  router.push("/collections");
};
</script>
