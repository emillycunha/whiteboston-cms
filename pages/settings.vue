<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Settings" />

    <!-- Profile Settings -->
    <div
      class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700"
    >
      <div class="p-4 sm:p-10">
        <form class="flex flex-col gap-y-8 p-4 sm:p-10">
          <!-- Feature Toggles -->
          <div>
            <h2
              class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
            >
              Feature Toggles
            </h2>
            <div class="space-y-4">
              <div
                v-for="feature in features"
                :key="feature.name"
                class="flex items-center justify-between"
              >
                <div class="flex flex-col items-left">
                  <span
                    class="text-base font-medium text-gray-700 dark:text-gray-300"
                    >{{ feature.label }}</span
                  >
                  <span
                    class="text-sm font-medium text-gray-500 dark:text-gray-300"
                  >
                    {{ feature.hint }}
                  </span>
                </div>
                <input
                  type="checkbox"
                  v-model="feature.enabled"
                  class="h-4 w-4 text-violet-500 border-gray-500 rounded focus:ring-violet-500 dark:focus:ring-teal-500 dark:text-teal-500"
                />
              </div>
            </div>
          </div>
          <div class="border-t border-gray-200 dark:border-slate-700"></div>
          <div>
            <h2
              class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200"
            >
              Add Collections
            </h2>
            <div class="space-y-4">
              <form
                @submit.prevent="createCollection"
                class="flex gap-4 items-center"
              >
                <input
                  v-model="newCollection"
                  type="text"
                  placeholder="Enter collection name (e.g., Events, FAQs)"
                  class="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2"
                />
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm"
                >
                  Add Collection
                </button>
              </form>
              <p v-if="collectionError" class="text-sm text-red-500 mt-2">
                {{ collectionError }}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Page Footer -->
    <PageFooter
      title=""
      :buttons="[
        {
          label: 'Back',
          icon: ChevronLeftIcon,
          iconPosition: 'before',
          variant: 'secondary',
          onClick: cancelSettings,
        },
        {
          label: 'Save Settings',
          icon: CheckCircleIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: saveSettings,
        },
      ]"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ChevronLeftIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

// Form data
const name = ref("John Doe");
const email = ref("john@example.com");
const password = ref("");

// Feature toggles
const features = ref([
  {
    name: "contacts",
    label: "Contacts",
    hint: "Manage and organize all your customer and business contact information in one place.",
    enabled: true,
  },
  {
    name: "leads",
    label: "Leads",
    hint: "Track and manage website inquiries or potential client opportunities effectively.",
    enabled: false,
  },
  {
    name: "blogs",
    label: "Blogs",
    hint: "Create, update, and manage blog posts to keep your audience engaged.",
    enabled: true,
  },
  {
    name: "tasks",
    label: "Tasks",
    hint: "Stay organized by assigning and tracking tasks to complete your goals efficiently.",
    enabled: true,
  },
]);

function saveSettings() {
  console.log("Settings saved:", {
    name: name.value,
    email: email.value,
    password: password.value,
    features: features.value,
  });
  alert("Settings saved successfully!");
}

function cancelSettings() {
  console.log("Settings changes discarded.");
  alert("Settings reset!");
}

// New collection input
const newCollection = ref("");
const collectionError = ref(null);

function createCollection() {
  if (!newCollection.value.trim()) {
    collectionError.value = "Collection name cannot be empty.";
    return;
  }

  console.log("New collection added:", newCollection.value);
  alert(`Collection "${newCollection.value}" created successfully!`);

  // Reset input and error
  newCollection.value = "";
  collectionError.value = null;
}
</script>
