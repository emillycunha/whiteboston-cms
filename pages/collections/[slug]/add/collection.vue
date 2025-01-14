<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Add New Collection" />

    <!-- Add Collection Form -->
    <form novalidate @submit.prevent="addCollection">
      <div
        class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700 mb-6"
      >
        <div class="p-4 sm:p-8">
          <div class="flex flex-wrap gap-y-4">
            <!-- Collection Name -->
            <div class="flex flex-col w-1/2 p-2 gap-y-1">
              <label for="name" class="font-bold text-gray-700 dark:text-white">
                Collection Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
                placeholder="Enter collection name"
                required
              />
              <div v-if="errors.name" class="text-sm text-red-500">
                {{ errors.name }}
              </div>
            </div>

            <!-- Collection Slug -->
            <div class="flex flex-col w-1/2 p-2 gap-y-1">
              <label for="slug" class="font-bold text-gray-700 dark:text-white">
                Slug
              </label>
              <input
                id="slug"
                v-model="form.slug"
                type="text"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
                placeholder="Enter unique slug"
                required
              />
              <div v-if="errors.slug" class="text-sm text-red-500">
                {{ errors.slug }}
              </div>
            </div>

            <!-- Description -->
            <div class="flex flex-col w-full p-2 gap-y-1">
              <label
                for="description"
                class="font-bold text-gray-700 dark:text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
                placeholder="Enter collection description"
              ></textarea>
              <div v-if="errors.description" class="text-sm text-red-500">
                {{ errors.description }}
              </div>
            </div>

            <!-- Position -->
            <div class="flex flex-col w-full p-2 gap-y-1">
              <label
                for="position"
                class="font-bold text-gray-700 dark:text-white"
              >
                Position
              </label>
              <input
                id="position"
                v-model.number="form.position"
                type="number"
                :min="1"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-fit"
                placeholder="Enter position (optional)"
              />
            </div>

            <!-- Hidden Toggle -->
            <div class="flex items-center p-2 gap-x-2">
              <input
                type="checkbox"
                id="is_hidden"
                v-model="form.is_hidden"
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
          <!-- Error and Success Messages -->
          <div>
            <div v-if="errors.general" class="text-sm text-red-500 mt-4">
              {{ errors.general }}
            </div>
            <div v-if="errors.length" class="mt-4 p-2 text-red-500 text-sm">
              {{ errors }}
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
            onClick: cancelAdd,
          },
          {
            label: 'Add Collection',
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
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const collectionsStore = useCollectionsStore();
const router = useRouter();
const errors = ref({});

const form = ref({
  name: "",
  slug: "",
  description: "",
  is_hidden: false,
  position: 0,
});

// Reset form on mount
onMounted(() => {
  form.value = {
    name: "",
    slug: "",
    description: "",
    is_hidden: false,
    position: 0,
  };
});

// Slugify Helper
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

// Watch for name input to auto-generate slug
watch(
  () => form.value.name,
  (newName) => {
    if (newName) {
      form.value.slug = slugify(newName);
    }
  }
);

// Validate Form
const validateForm = () => {
  errors.value = {}; // Reset errors

  if (!form.value.name.trim()) {
    errors.value.name = "Name is required.";
  }
  if (!form.value.slug.trim()) {
    errors.value.slug = "Slug is required.";
  }

  return Object.keys(errors.value).length === 0;
};

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

    // Set error for UI feedback if needed
    errors.value = "You do not have permission to add collections.";

    return; // Exit early
  }

  if (!validateForm()) return;

  try {
    // Check if the slug already exists
    const existingSlug = await collectionsStore.checkSlugExists(
      form.value.slug
    );
    if (existingSlug) {
      errors.value.slug =
        "Collection slug already exists. Please use a unique slug.";
      return;
    }

    // Add the collection
    const success = await collectionsStore.addCollection({
      name: form.value.name,
      slug: form.value.slug,
      description: form.value.description,
      is_hidden: form.value.is_hidden,
      position: form.value.position,
    });

    if (success) {
      // Show success notification
      notificationStore.showNotification(
        "success",
        "Collection added successfully!"
      );

      // Clear the cache and reload the collections after redirect
      collectionsStore.clearCollections();

      // Redirect to the new collection's edit page
      const newSlug = form.value.slug;
      await router.push(
        `/collections/${newSlug}/edit?collection=${newSlug}&edit=true`
      );
    } else {
      console.error("Failed to add collection:", collectionsStore.error);
      errors.value.general = "Failed to add collection. Please try again.";
    }
  } catch (err) {
    errors.value.general = "An unexpected error occurred. Please try again.";
    console.error("Add Collection Error:", err);
  }
};

// Cancel Add
const cancelAdd = () => {
  router.push("/collections");
};
</script>
