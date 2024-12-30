<template>
  <div class="px-6 py-4 space-y-6">
    <PageHeader :title="`Add Item to ${collectionName}`" />

    <div v-if="isLoading" class="text-center">Loading collection fields...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <form v-if="!isLoading && fields.length" @submit.prevent="addItem">
      <div class="space-y-4">
        <div
          v-for="field in fields"
          :key="field.key"
          class="flex flex-col space-y-1"
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
            type="date"
            v-model="formData[field.key]"
            :id="field.key"
            class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
          />

          <!-- Select Field -->
          <select
            v-else-if="field.type === 'select' && field.options"
            v-model="formData[field.key]"
            :id="field.key"
            class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
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
            v-model="formData[field.key]"
            :id="field.key"
            class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
            :placeholder="`Enter ${field.label}`"
          ></textarea>

          <!-- Checkbox for Boolean -->
          <div
            v-else-if="field.type === 'boolean'"
            class="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              v-model="formData[field.key]"
              :id="field.key"
              class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <!-- Default Input -->
          <input
            v-else
            :type="field.type"
            v-model="formData[field.key]"
            :id="field.key"
            class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
            :placeholder="`Enter ${field.label}`"
          />
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

// Get Route Params
const route = useRoute();
const router = useRouter();
const collectionSlug = route.params.slug;

// State and Store
const contentStore = useContentStore();
const isLoading = computed(() => contentStore.isLoading);
const error = computed(() => contentStore.error);
const fields = computed(() => contentStore.fields); // Fields for the collection
const collectionName = computed(
  () => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)
);

// Form Data
const formData = ref({});

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

// Watch the title field and auto-generate slug
watch(
  () => formData.value["Title"], // Watch the "title" field
  (newTitle) => {
    if (newTitle) {
      formData.value["Slug"] = slugify(newTitle); // Generate slug
    }
  }
);

// Add item with validation
const addItem = async () => {
  if (!validateForm()) {
    console.log("Validation failed");
    return;
  }

  // Extract the actual values from formData
  const dataToSubmit = Object.keys(formData.value).reduce((acc, key) => {
    acc[key] = formData.value[key]; // Directly assign the value
    return acc;
  }, {});

  console.log("Data to Submit:", dataToSubmit); // Debug the data being submitted

  const success = await contentStore.addContentItem(
    collectionSlug,
    dataToSubmit
  );
  if (success) {
    router.push(`/collections/${collectionSlug}`);
  }
};

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
  return null; // No errors
};

// Validate the entire form
const validateForm = () => {
  let isValid = true;
  fields.value.forEach((field) => {
    const error = validateField(field, formData.value[field.key]);
    if (error) {
      isValid = false;
      console.error(error);
    }
  });
  return isValid;
};

// Initialize form data with validation
onMounted(async () => {
  await contentStore.fetchContentAndFields(collectionSlug);

  // Initialize formData with default or empty values
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
});

// Cancel Add
const cancelAdd = () => {
  router.push(`/collections/${collectionSlug}`);
};
</script>
