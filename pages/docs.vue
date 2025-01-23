<!-- 
  Developer Note:
  This page allows users to manage collections, including:
  - Updating collection metadata (e.g., name, slug, description).
  - Adding new fields to the collection.
  - Editing existing fields in the collection.
-->

<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader :title="`Editing Collection: ${collectionName}`" />

    <div v-if="isLoading" class="text-center">Loading collection fields...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <BaseForm :fields="fields" :editable="editable" @submit="saveChanges" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

// Route and Router
const route = useRoute();
const router = useRouter();
//const collectionSlug = route.params.slug;

// State and Store
const contentStore = useContentStore();
const collectionsStore = useCollectionsStore();
const collection = ref({
  name: "",
  slug: "",
  description: "",
  is_hidden: false,
  position: 0,
});

const isLoading = computed(() => contentStore.isLoading);
const errors = ref([]);
const error = computed(() => contentStore.error);
//const collectionName = computed(
//  () => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)
//);

const collectionName = "Reviews";
const collectionSlug = "reviews";

// Editable Fields
const fields = ref([
  {
    key: "name",
    label: "Name",
    type: "text",
    value: collection.name,
    isRequired: true,
  },
  {
    key: "slug",
    label: "Slug",
    type: "text",
    value: collection.slug,
    isRequired: true,
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    value: collection.description,
    isRequired: false,
  },
  {
    key: "is_hidden",
    label: "Hidden",
    value: collection.is_hidden,
    type: "boolean",
    isRequired: false,
  },
  {
    key: "position",
    label: "Position",
    type: "number",
    value: collection.position,
    isRequired: false,
  },
]);

let originalSlug = "";
const editable = ref(true);

onMounted(async () => {
  try {
    // Fetch collection details
    const collectionData = await collectionsStore.fetchCollectionBySlug(
      collectionSlug
    );

    // Ensure the collection data exists
    if (collectionData) {
      // Map the fetched data to fields
      fields.value.forEach((field) => {
        if (collectionData[field.key] !== undefined) {
          field.value = collectionData[field.key];
        }
      });

      // Store the original slug for potential future use
      originalSlug = collectionData.slug;

      console.log("[Initialized Collection]", collectionData);
      console.log("[Updated Fields Data]", fields.value);
    }
  } catch (err) {
    console.error("[Error Loading Collection]:", err);
  }
});

// Save changes
const saveChanges = async () => {
  // Check if the user has the required permission
  if (!authStore.canEdit) {
    console.error(
      "[Save Changes] User does not have permission to edit collections."
    );

    notificationStore.showNotification(
      "error",
      "You do not have permission to edit this collection."
    );

    errors.value = "You do not have permission to edit this collection.";

    return; // Exit early
  }

  // Reset errors
  errors.value = "";

  // Step 1: Validate Collection Metadata
  if (!collection.value.name.trim()) {
    errors.value = "Collection name cannot be empty.";
    return;
  }
  if (!collection.value.slug.trim()) {
    errors.value = "Collection slug cannot be empty.";
    return;
  }
  if (
    typeof collection.value.position !== "number" ||
    collection.value.position < 0
  ) {
    errors.value = "Position must be a valid positive number.";
    return;
  }

  // Step 2: Validate Slug Uniqueness
  if (collection.value.slug !== originalSlug) {
    const slugExists = await collectionsStore.checkSlugExists(
      collection.value.slug
    );
    if (slugExists) {
      errors.value = "The slug is already in use by another collection.";
      return;
    }
  }

  // Step 3: Validate Fields
  const hasInvalidNames = fields.value.some(
    (field) => field.name === "New Field" || field.name.trim() === ""
  );
  if (hasInvalidNames) {
    errors.value =
      "Please rename all fields with the default name ('New Field') before saving.";
    return;
  }

  // Split fields into new and existing
  const newFields = fields.value.filter((field) => !field.id);
  const existingFields = fields.value.filter((field) => field.id);

  const updatedFields = existingFields.map((field) => ({
    id: field.id,
    name: field.name,
    type: field.type,
    position: field.position,
    is_required: field.is_required,
    default_value: field.default_value,
    options:
      field.type === "select" && field.options
        ? field.options.split(",").map((opt) => ({
            label: opt.trim(),
            value: opt.trim().toLowerCase().replace(/\s+/g, "_"),
          })) // Convert back to array of objects for saving
        : null,
  }));

  // Prepare data for inserts
  const newFieldsToInsert = newFields.map((field) => ({
    name: field.name,
    type: field.type,
    position: field.position,
    is_required: field.is_required || false,
    default_value: field.default_value || null,
    options:
      field.type === "select" && field.options
        ? field.options.split(",").map((opt) => ({
            label: opt.trim(),
            value: opt.trim().toLowerCase().replace(/\s+/g, "_"),
          }))
        : null,
  }));

  try {
    let messages = [];

    // Step 1: Update collection metadata (name, slug, etc.)
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

    // Step 2: Update existing fields
    if (updatedFields.length) {
      const { error: updateError } = await contentStore.updateCollectionFields(
        collectionSlug,
        updatedFields
      );
      if (updateError) throw updateError;

      messages.push(" Field(s) updated successfully.");
    }

    // Step 3: Insert new fields
    if (newFieldsToInsert.length) {
      const { error: insertError } = await contentStore.addNewCollectionFields(
        collectionSlug,
        newFieldsToInsert
      );
      if (insertError) throw insertError;

      messages.push("New field(s) added successfully.");
    }

    // Show success notification
    const finalMessage = messages.length
      ? messages.join(" ")
      : "Collection and fields updated successfully.";
    notificationStore.showNotification("success", finalMessage);

    router.push(`/collections`);
  } catch (err) {
    console.error("Failed to update collection fields:", err);
    errors.value = "Failed to update or add collection fields.";
  }
};

// Cancel changes
const cancelChanges = () => {
  navigateTo({
    path: `/collections`,
  });
};
</script>
