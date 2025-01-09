<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader :title="`Editing Collection: ${collectionName}`" />

    <div v-if="isLoading" class="text-center">Loading collection fields...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <form v-if="!isLoading && fields.length" @submit.prevent="saveChanges">
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
                  type="text"
                  id="name"
                  disabled
                  v-model="collection.name"
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
                  type="text"
                  id="slug"
                  disabled
                  v-model="collection.slug"
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
                  type="number"
                  id="position"
                  v-model.number="collection.position"
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
                  type="checkbox"
                  id="is_hidden"
                  v-model="collection.is_hidden"
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
                  <tr v-for="(field, index) in fields" :key="field.key">
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
import { useContentStore } from "~/stores/content";
import { useCollectionsStore } from "~/stores/collections";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

// Route and Router
const route = useRoute();
const router = useRouter();
const collectionSlug = route.params.slug;

// State and Store
const contentStore = useContentStore();
const collectionsStore = useCollectionsStore();
const collection = ref(null);

const isLoading = computed(() => contentStore.isLoading);
const error = computed(() => contentStore.error);
const collectionName = computed(
  () => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)
);

// Editable Fields
const fields = ref([]);

onMounted(async () => {
  try {
    const collectionData = await collectionsStore.fetchCollectionBySlug(
      collectionSlug
    );

    // Initialize collection details
    if (collectionData) {
      collection.value = {
        name: collectionData.name,
        slug: collectionData.slug,
        description: collectionData.description,
        is_hidden: collectionData.is_hidden,
        position: collectionData.position,
      };
    }

    // Fetch fields
    await contentStore.fetchContentAndFields(collectionSlug);

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
  // Check if any field names are still set to the default
  const hasInvalidNames = fields.value.some(
    (field) => field.name === "New Field"
  );

  if (hasInvalidNames) {
    alert(
      "Please rename all fields with the default name ('New Field') before saving."
    );
    return; // Prevent saving
  }

  const updatedFields = fields.value.map((field) => ({
    id: field.id || undefined,
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

  const success = await contentStore.updateCollectionFields(
    collectionSlug,
    updatedFields
  );

  if (success) {
    alert("Collection fields updated successfully.");
    router.push(`/collections`);
  }
};

// Cancel changes
const cancelChanges = () => {
  navigateTo({
    path: `/collections`,
  });
};
</script>
