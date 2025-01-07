<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Add New Collection" />

    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- Add Collection Form -->
    <form @submit.prevent="addCollection">
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
                type="text"
                id="name"
                v-model="form.name"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
                placeholder="Enter collection name"
                required
              />
            </div>

            <!-- Collection Slug -->
            <div class="flex flex-col w-1/2 p-2 gap-y-1">
              <label for="slug" class="font-bold text-gray-700 dark:text-white">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                v-model="form.slug"
                class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 w-full"
                placeholder="Enter unique slug"
                required
              />
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
                type="number"
                id="position"
                v-model.number="form.position"
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
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { useCollectionsStore } from "~/stores/collections";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

const collectionsStore = useCollectionsStore();

const router = useRouter();
const error = ref(null);
const form = ref({
  name: "",
  slug: "",
  description: "",
  is_hidden: false,
  position: 0,
});

// Get Organization ID
const authStore = useAuthStore();
const organizationId = authStore.org_id;
console.log("[Add Collection] Retrieved organizationId:", organizationId);

// Initialize Form
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
  if (!form.value.name.trim()) {
    error.value = "Name is required.";
    return false;
  }
  if (!form.value.slug.trim()) {
    error.value = "Slug is required.";
    return false;
  }
  return true;
};

// Add New Collection
const addCollection = async () => {
  if (!validateForm()) return;

  const success = await collectionsStore.addCollection({
    name: form.value.name,
    slug: form.value.slug,
    description: form.value.description,
    is_hidden: form.value.is_hidden,
    position: form.value.position,
  });

  if (success) {
    alert("Collection added successfully!");

    // Clear the cache and reload the collections after redirect
    collectionsStore.clearCollections();
    router.push("/collections").then(() => {
      collectionsStore.fetchCollectionsForCurrentOrg();
    });
  } else {
    console.error("Failed to add collection:", collectionsStore.error);
  }
};

// Cancel Add
const cancelAdd = () => {
  router.push("/collections");
};
</script>
