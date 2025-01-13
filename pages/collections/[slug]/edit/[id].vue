<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader :title="`Editing`" />

    <div v-if="isLoading" class="text-center">Loading item...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- Custom Form -->
    <form v-if="!isLoading && fields.length" @submit.prevent="saveChanges">
      <div
        class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700 mb-6"
      >
        <div class="p-4 sm:p-8">
          <div class="flex flex-wrap gap-y-4">
            <div
              v-for="field in fields"
              :key="field.key"
              :class="[
                'flex flex-col space-y-2 p-2',
                field.type === 'text' ? 'w-1/2' : 'w-full',
              ]"
            >
              <label
                :for="field.key"
                class="font-bold text-gray-700 dark:text-white"
              >
                {{ field.label }}
              </label>

              <!-- Date Picker -->
              <input
                v-if="field.type === 'date'"
                v-model="field.value"
                :id="field.key"
                type="date"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-1/2"
              />

              <!-- Select Field -->
              <select
                v-else-if="field.type === 'select' && field.options"
                :id="field.key"
                v-model="field.value"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-1/2"
              >
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>

              <!-- Textarea Field -->
              <textarea
                v-else-if="field.type === 'textarea'"
                :id="field.key"
                v-model="field.value"
                :rows="10"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
                :placeholder="`Enter ${field.label}`"
              ></textarea>

              <!-- Checkbox for Boolean -->
              <div
                v-else-if="field.type === 'boolean'"
                class="flex items-center space-x-2"
              >
                <input
                  :id="field.key"
                  v-model="field.value"
                  type="checkbox"
                  class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <!-- Default Input -->
              <input
                v-else
                :id="field.key"
                v-model="field.value"
                :type="field.type"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
                :placeholder="`Enter ${field.label}`"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Form Buttons -->
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
            type: 'submit',
          },
        ]"
      />
    </form>
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
  try {
    // Fetch content and fields for the collection
    await contentStore.fetchContentAndFields(collectionSlug);

    // Fetch the specific content item
    const item = await contentStore.fetchContentItem(collectionSlug, itemId);
    if (!item) {
      throw new Error("Item not found");
    }
    console.log("[Debug] Item Loaded for Editing:", item);

    // Map fields with the content data
    fields.value = contentStore.fields.map((field) => ({
      key: field.key,
      label: field.label,
      type: field.type,
      value: item.data[field.key] || "", // Use the fetched `item`
      options: field.options || [],
      isRequired: field.is_required,
    }));

    console.log("[Debug] Fields Loaded:", fields.value);
  } catch (err) {
    console.error("[Error Loading Fields]:", err);
  }
});

// Save Changes
const saveChanges = async () => {
  // Prepare updated data from fields
  const updatedData = fields.value.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  try {
    // Update content item
    const success = await contentStore.updateContentItem(
      collectionSlug,
      itemId,
      updatedData
    );

    if (success) {
      router.push(`/collections/${collectionSlug}`);
    } else {
      console.error("Failed to save changes.");
    }
  } catch (err) {
    console.error("Error saving changes:", err);
  }
};

const cancelEdit = () => {
  router.push(`/collections/${collectionSlug}`);
};
</script>
