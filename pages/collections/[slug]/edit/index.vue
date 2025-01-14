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

    <form
      v-if="!isLoading && fields.length"
      novalidate
      @submit.prevent="saveChanges"
    >
      <div
        class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700 mb-6"
      >
        <div class="p-2 sm:p-4">
          <!-- Collection Metadata Section -->
          <div class="text-sm p-2 sm:p-4">
            <div class="flex flex-wrap gap-y-4">
              <!-- Collection Name -->
              <div class="flex flex-col w-1/2 gap-y-1 p-2">
                <label
                  for="name"
                  class="font-bold text-gray-700 dark:text-white"
                >
                  Collection Name
                </label>
                <input
                  id="name"
                  v-model="collection.name"
                  type="text"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 disabled:opacity-50"
                />
              </div>

              <!-- Collection Slug -->
              <div class="flex flex-col w-1/4 gap-y-1 p-2">
                <label
                  for="slug"
                  class="font-bold text-gray-700 dark:text-white"
                >
                  Slug
                </label>
                <input
                  id="slug"
                  v-model="collection.slug"
                  type="text"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 disabled:opacity-50"
                />
              </div>

              <!-- Position -->
              <div class="flex flex-col w-1/4 gap-y-1 p-2">
                <label
                  for="position"
                  class="font-bold text-gray-700 dark:text-white"
                >
                  Position
                </label>
                <input
                  id="position"
                  v-model.number="collection.position"
                  type="number"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-fit"
                />
              </div>

              <!-- Description -->
              <div class="flex flex-col w-full gap-y-1 p-2">
                <label
                  for="description"
                  class="font-bold text-gray-700 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="collection.description"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
                ></textarea>
              </div>

              <!-- Hidden Toggle -->
              <div class="flex items-center gap-x-2 p-2">
                <input
                  id="is_hidden"
                  v-model="collection.is_hidden"
                  type="checkbox"
                  class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  for="is_hidden"
                  class="font-bold text-gray-700 dark:text-white"
                >
                  Hidden
                </label>
              </div>
            </div>
          </div>

          <!-- Editable Fields Table -->
          <div class="p-2 sm:p-4">
            <div>
              <table class="w-full text-base table-auto">
                <thead class="">
                  <tr
                    class="text-left text-gray-700 dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-700"
                  >
                    <th class="px-4 py-2 text-left text-sm font-semibold">
                      Field Name
                    </th>
                    <th class="px-4 py-2 text-left text-sm font-semibold">
                      Type
                    </th>
                    <th class="px-4 py-2 text-left text-sm font-semibold">
                      Position
                    </th>
                    <th class="px-4 py-2 text-left text-sm font-semibold">
                      Options
                    </th>
                  </tr>
                </thead>
                <tbody class="text-sm text-gray-600 dark:text-gray-100">
                  <tr
                    v-for="(field, index) in fields"
                    :key="field.key"
                    class=""
                  >
                    <td class="px-4 py-2">
                      <input
                        type="text"
                        v-model="field.name"
                        class="w-full border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 disabled:opacity-50"
                      />
                    </td>
                    <td class="px-4 py-2">
                      <select
                        v-model="field.type"
                        class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="select">Select</option>
                        <option value="boolean">Boolean</option>
                        <option value="textarea">Textarea</option>
                      </select>
                    </td>
                    <td class="px-4 py-2">
                      <select
                        v-model="field.position"
                        class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
                      >
                        <option v-for="i in fields.length" :value="i">
                          {{ i }}
                        </option>
                      </select>
                    </td>
                    <td class="px-4 py-2">
                      <textarea
                        v-if="field.type === 'select'"
                        v-model="field.options"
                        placeholder="Comma-separated values (e.g., Option 1, Option 2)"
                        class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
                      ></textarea>
                    </td>
                    <td class="px-4 py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Add Field Button -->
            <button
              @click="addField"
              type="button"
              class="mt-2 ml-3 px-3 py-1 bg-violet-500 text-white text-sm rounded-md"
            >
              Add New Field
            </button>
            <!-- Error and Success Messages -->
            <div>
              <div v-if="errors.length" class="mt-4 p-2 text-red-500 text-sm">
                {{ errors }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <PageFooter
        title=""
        :buttons="[
          {
            label: 'Cancel',
            icon: XCircleIcon,
            iconPosition: 'before',
            variant: 'secondary',
            onClick: cancelChanges,
            type: 'button',
          },
          {
            label: 'Save',
            icon: CheckCircleIcon,
            iconPosition: 'after',
            variant: 'primary',
            type: 'submit',
          },
        ]"
      />
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

// Route and Router
const route = useRoute();
const router = useRouter();
const collectionSlug = route.params.slug;

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
const collectionName = computed(
  () => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)
);

// Editable Fields
const fields = ref([]);
let originalSlug = "";

onMounted(async () => {
  try {
    const collectionData = await collectionsStore.fetchCollectionBySlug(
      collectionSlug
    );

    // Initialize collection details
    if (collectionData) {
      collection.value = {
        id: collectionData.id,
        name: collectionData.name,
        slug: collectionData.slug,
        description: collectionData.description,
        is_hidden: collectionData.is_hidden,
        position: collectionData.position,
      };
      originalSlug = collectionData.slug;
      console.log("[Initialized Collection]", collection.value);
    }

    // Fetch fields
    await contentStore.fetchContentAndFields(collectionSlug);
    console.log("[Fields Data]", contentStore.fields);

    // If no fields exist, add a default one
    if (!contentStore.fields.length) {
      fields.value.push({
        key: "new_field_1",
        name: "New Field",
        type: "text",
        position: 1,
        options: null,
      });
    } else {
      // Initialize fields for editing
      fields.value = (contentStore.fields || []).map((field) => ({
        id: field.id,
        key:
          field.key ||
          (field.name
            ? field.name.toLowerCase().replace(/\s+/g, "_")
            : `field_${Math.random().toString(36).substr(2, 5)}`),
        name: field.label || field.name || "Unnamed Field",
        type: [
          "text",
          "number",
          "date",
          "select",
          "boolean",
          "textarea",
        ].includes(field.type)
          ? field.type
          : "text",
        position: typeof field.position === "number" ? field.position : 99,
        options: Array.isArray(field.options)
          ? field.options.map((opt) => opt.label || "").join(", ")
          : null,
      }));
    }
  } catch (err) {
    error.value = "Failed to load collection details.";
  }
});

// Add a new field
const addField = () => {
  fields.value.push({
    key: `new_field_${fields.value.length}`,
    name: "New Field",
    type: "text",
    position: fields.value.length + 1,
    options: null,
  });
};

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
