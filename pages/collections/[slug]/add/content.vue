<template>
  <div class="px-6 py-4 space-y-6">
    <PageHeader :title="`Add Item to ${collectionName}`" />

    <div v-if="isLoading" class="text-center">Loading collection fields...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- No Fields Message -->
    <div v-if="!isLoading && !fields.length" class="text-center">
      <p class="text-gray-600 dark:text-gray-200">
        This collection currently has no fields.<br />
        You can add fields to this collection by clicking
        <a :href="editFieldsLink" class="text-violet-500 hover:underline"
          >here</a
        >.
      </p>
    </div>

    <form
      v-if="!isLoading && fields.length"
      @submit.prevent="addItem"
      novalidate
    >
      <div
        class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700 mb-6"
      >
        <div class="p-4 sm:p-8">
          <div class="flex flex-wrap gap-y-4">
            <div
              v-for="(field, index) in fields"
              :key="field.key || `fallback_${index}`"
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
                :id="field.key"
                type="date"
                v-model="formData[field.key]"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-1/2"
              />

              <!-- Select Field -->
              <select
                v-else-if="field.type === 'select' && field.options"
                v-model="formData[field.key]"
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
                v-model="formData[field.key]"
                :rows="10"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
                :placeholder="`Enter ${field.label}`"
              ></textarea>

              <RichTextEditor
                v-else-if="field.type === 'richtext'"
                :id="field.key"
                v-model="formData[field.key]"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
                :placeholder="`Enter ${field.label}`"
              ></RichTextEditor>

              <!-- Checkbox for Boolean -->
              <div
                v-else-if="field.type === 'boolean'"
                class="flex items-center space-x-2"
              >
                <input
                  :id="field.key"
                  type="checkbox"
                  v-model="formData[field.key]"
                  class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <!-- Default Input -->
              <input
                v-else
                :id="field.key"
                :type="field.type"
                v-model="formData[field.key]"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
                :placeholder="`Enter ${field.label}`"
              />

              <!-- Field-Specific Error -->
              <div v-if="errors[field.key]" class="text-sm text-red-500 mt-1">
                {{ errors[field.key] }}
              </div>
            </div>
          </div>
          <!-- General Error Message -->
          <div v-if="errors.general" class="text-red-500 text-sm mb-4">
            {{ errors.general }}
          </div>
        </div>
      </div>

      <PageFooter
        title=""
        :buttons="[
          {
            label: 'Cancel',
            icon: XCircleIcon,
            iconPosition: 'before',
            variant: 'secondary',
            onClick: cancelAdd,
          },
          {
            label: 'Add Item',
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
import { ref, onMounted, computed, watch } from "vue";
import { useContentStore } from "~/stores/content";
import { useRoute, useRouter } from "vue-router";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

import { useNotificationStore } from "@/stores/notification";
const notificationStore = useNotificationStore();

// Get Route Params
const route = useRoute();
const router = useRouter();
const collectionSlug = route.params.slug;

// State and Store
const contentStore = useContentStore();
const isLoading = computed(() => contentStore.isLoading);
const error = computed(() => contentStore.error);
const fields = computed(() => contentStore.fields || []);
const collectionName = computed(
  () => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)
);

// Form Data
const formData = ref({});
const errors = ref({});

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// Watch the title field and auto-generate slug
watch(
  () => formData.value["Title"],
  (newTitle) => {
    if (newTitle) {
      formData.value["Slug"] = slugify(newTitle);
    }
  }
);

// Validate a single field
const validateField = (field, value) => {
  if (field.type === "text" && !value.trim()) {
    return `${field.label} is required.`;
  }
  if (field.type === "number" && (isNaN(value) || value === "")) {
    return `${field.label} must be a valid number.`;
  }
  if (field.type === "date" && !Date.parse(value)) {
    return `${field.label} must be a valid date.`;
  }
  if (
    field.type === "select" &&
    field.options &&
    !field.options.some((opt) => opt.value === value)
  ) {
    return `${field.label} must be one of the predefined options.`;
  }
  return null;
};

// Validate the entire form
const validateForm = () => {
  errors.value = {}; // Reset errors object
  let isValid = true;

  fields.value.forEach((field) => {
    const error = validateField(field, formData.value[field.key]);
    if (error) {
      isValid = false;
      errors.value[field.key] = error; // Only set the error for the current field
    }
  });

  return isValid;
};

// Add item with validation
const addItem = async () => {
  if (!validateForm()) {
    console.log("Validation failed");
    return;
  }

  // Extract the actual values from formData
  const dataToSubmit = Object.keys(formData.value).reduce((acc, key) => {
    acc[key] = formData.value[key];
    return acc;
  }, {});

  try {
    const success = await contentStore.addContentItem(
      collectionSlug,
      dataToSubmit
    );
    if (success) {
      notificationStore.showNotification(
        "success",
        "Item added successfully to the collection!"
      );
      router.push(`/collections/${collectionSlug}`);
    } else {
      errors.value.general = "Failed to add item. Please try again.";
    }
  } catch (err) {
    errors.value.general = "An unexpected error occurred. Please try again.";
    console.error("Error while adding item:", err);
  }
};

// Initialize form data with validation
onMounted(async () => {
  await contentStore.fetchContentAndFields(collectionSlug);

  // Initialize formData with default values
  fields.value.forEach((field) => {
    if (field.type === "number") {
      formData.value[field.key] = 0;
    } else if (field.type === "boolean") {
      formData.value[field.key] = false;
    } else if (field.type === "date") {
      formData.value[field.key] = new Date().toISOString().split("T")[0];
    } else if (
      field.type === "select" &&
      field.options &&
      field.options.length
    ) {
      formData.value[field.key] = field.options[0].value;
    } else {
      formData.value[field.key] = "";
    }
  });

  console.log("FormData after initialization:", formData.value); // Log formData
});

// Cancel Add
const cancelAdd = () => {
  router.push(`/collections/${collectionSlug}`);
};

// Edit Fields Link
const editFieldsLink = `/collections/${collectionSlug}/edit?collection=${collectionSlug}&edit=true`;
</script>
