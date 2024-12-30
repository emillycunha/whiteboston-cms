<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader :title="`Edit Collection: ${collectionName}`" />

    <div v-if="isLoading" class="text-center">Loading collection fields...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <form v-if="!isLoading && fields.length" @submit.prevent="saveChanges">
      <!-- Editable Fields Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-semibold">
                Field Name
              </th>
              <th class="px-4 py-2 text-left text-sm font-semibold">Type</th>
              <th class="px-4 py-2 text-left text-sm font-semibold">
                Position
              </th>
              <th class="px-4 py-2 text-left text-sm font-semibold">Options</th>
              <th class="px-4 py-2 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody
            class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
          >
            <tr v-for="(field, index) in fields" :key="field.key">
              <td class="px-4 py-2">
                <input
                  type="text"
                  v-model="field.name"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2"
                />
              </td>
              <td class="px-4 py-2">
                <select
                  v-model="field.type"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2"
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
                <input
                  type="number"
                  v-model="field.position"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2"
                />
              </td>
              <td class="px-4 py-2">
                <textarea
                  v-if="field.type === 'select'"
                  v-model="field.options"
                  placeholder="Comma-separated values (e.g., Option 1, Option 2)"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2"
                ></textarea>
              </td>
              <td class="px-4 py-2">
                <button
                  @click="removeField(index)"
                  type="button"
                  class="px-3 py-1 bg-red-500 text-white rounded-md"
                >
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Field Button -->
      <button
        @click="addField"
        type="button"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Add New Field
      </button>

      <!-- Save Button -->
      <PageFooter
        title=""
        :buttons="[
          {
            label: 'Cancel',
            variant: 'secondary',
            onClick: cancelChanges,
          },
          {
            label: 'Save Changes',
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

// Route and Router
const route = useRoute();
const router = useRouter();
const collectionSlug = route.params.slug;

// State and Store
const contentStore = useContentStore();
const isLoading = computed(() => contentStore.isLoading);
const error = computed(() => contentStore.error);
const collectionName = computed(
  () => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)
);

// Editable Fields
const fields = ref([]);

// Fetch collection fields
onMounted(async () => {
  await contentStore.fetchContentAndFields(collectionSlug);

  // Initialize fields for editing
  fields.value = contentStore.fields.map((field) => ({
    name: field.key || "Unnamed Field", // Use `key` as a fallback if `name` is missing
    ...field,
    options:
      field.type === "select" && Array.isArray(field.options)
        ? field.options.map((opt) => opt.label).join(", ") // Convert options array to string
        : null,
  }));
});

// Add a new field
const addField = () => {
  fields.value.push({
    key: `new_field_${fields.value.length}`,
    label: "New Field",
    type: "text",
    position: fields.value.length + 1,
    options: null,
  });
};

// Remove a field
const removeField = (index) => {
  fields.value.splice(index, 1);
};

// Save changes
const saveChanges = async () => {
  const updatedFields = fields.value.map((field) => ({
    ...field,
    options:
      field.type === "select" && field.options
        ? field.options.split(",").map((opt) => ({
            label: opt.trim(),
            value: opt.trim().toLowerCase().replace(/\s+/g, "_"),
          })) // Convert back to array of objects
        : null,
  }));

  const success = await contentStore.updateCollectionFields(
    collectionSlug,
    updatedFields
  );

  if (success) {
    alert("Collection fields updated successfully.");
    router.push(`/collections/${collectionSlug}`);
  }
};

// Cancel changes
const cancelChanges = () => {
  router.push(`/collections/${collectionSlug}`);
};
</script>
