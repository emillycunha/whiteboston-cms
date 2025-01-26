<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Settings" />

    <div
      class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700"
    >
      <div
        v-if="collections.length > 0"
        class="p-4 sm:p-8 flex flex-col gap-x-16"
      >
        <!-- Sidebar Order -->
        <div v-if="userRole === 'admin'" class="p-2">
          <h3 class="text-base font-semibold">Sidebar Collections Order</h3>
          <p class="text-sm text-gray-600">
            Collections in the sidebar are displayed based on the order below.
          </p>

          <!-- Collections List -->
          <ul class="mt-4 space-y-2 border border-gray-200 rounded-md p-4">
            <li
              v-for="(collection, index) in collections"
              :key="collection.id"
              class="flex items-center justify-between bg-white"
            >
              <div>
                <span class="text-gray-700 dark:text-white font-medium">
                  {{ index + 1 }}. {{ collection.name }}</span
                >
              </div>

              <!-- Arrow Buttons -->
              <div class="flex space-x-2">
                <!-- Move Up -->
                <button
                  :disabled="index === 0"
                  class="p-1 bg-violet-500 text-white rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  @click="moveUp(index)"
                >
                  <ChevronUpIcon class="h-4 2-4" />
                </button>

                <!-- Move Down -->
                <button
                  :disabled="index === collections.length - 1"
                  class="p-1 bg-violet-500 text-white rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  @click="moveDown(index)"
                >
                  <ChevronDownIcon class="h-4 w-4" />
                </button>
              </div>
            </li>
          </ul>
        </div>
        <!-- Dashboard Stats -->
        <div class="p-2">
          <h3 class="font-bold text-base">Select Dashboard Stats</h3>
          <p class="text-sm text-gray-600">
            Choose up to 3 collections to display on the dashboard stats cards.
          </p>
          <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>

          <div class="flex justify-end">
            <button
              class="px-3 py-2 text-xs bg-violet-500 text-white rounded"
              @click="clearSelection"
            >
              Clear Selection
            </button>
          </div>
          <div>
            <div class="mt-4 space-y-2 border border-gray-200 rounded-md p-4">
              <div
                v-for="collection in availableCollections"
                :key="collection"
                class="flex items-center space-x-3"
              >
                <label
                  :for="collection"
                  class="text-gray-700 dark:text-white font-medium has-checked:text-violet-500"
                >
                  <input
                    :id="collection"
                    v-model="selectedStats"
                    type="checkbox"
                    :value="collection"
                    class="h-4 w-4 accent-violet-500 dark:accent-teal-500"
                    @change="handleCheckboxChange(collection)"
                  />

                  {{ collection }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Collections Note -->
      <div
        v-else
        class="mt-4 p-4 rounded-md text-center text-gray-600 dark:text-gray-300"
      >
        <p>No collections available.</p>
        <p>
          Add collections by navigating to the
          <NuxtLink href="/collections" class="text-violet-500 underline"
            >Collections Page</NuxtLink
          >.
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="flex justify-end p-6">
        <div class="text-red-500 text-sm">
          {{ error }}
        </div>
      </div>
    </div>

    <PageFooter
      v-if="collections.length > 0"
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
//import { ref, onMounted } from "vue";

import {
  ChevronLeftIcon,
  CheckCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";

import { useNotificationStore } from "@/stores/notification";
const notificationStore = useNotificationStore();

const authStore = useAuthStore();
const userRole = computed(() => authStore.role);

const collectionsStore = useCollectionsStore();

const selectedStats = ref([]);
const availableCollections = ref([]);
const collections = ref([]);
const error = ref("");

const clearSelection = () => {
  selectedStats.value = [];
  error.value = "";
};

onMounted(async () => {
  const orgId = authStore.org_id;
  if (!orgId) {
    return;
  }

  try {
    await collectionsStore.fetchCollectionsForCurrentOrg();
    collections.value = collectionsStore.collections;

    availableCollections.value = collectionsStore
      .getCollectionsByOrg(orgId)
      .map((collection) => collection.slug);

    const userPreferences = authStore.preferences?.dashboard?.stats || [];
    selectedStats.value = userPreferences;
    error.value = "";
  } catch (err) {
    error.value = "Failed to load collections or preferences.";
  }
});

const handleCheckboxChange = (collection) => {
  if (selectedStats.value.length > 3) {
    selectedStats.value = selectedStats.value.filter(
      (item) => item !== collection
    );
    error.value = "You can select a maximum of 3 collections.";
  } else {
    error.value = "";
  }
};

// Move an item up
const moveUp = (index) => {
  if (index > 0) {
    const current = collections.value[index];
    const above = collections.value[index - 1];

    const temp = current.position;
    current.position = above.position;
    above.position = temp;

    collections.value.splice(index - 1, 2, current, above);
  }
};

// Move an item down
const moveDown = (index) => {
  if (index < collections.value.length - 1) {
    const current = collections.value[index];
    const below = collections.value[index + 1];

    // Swap positions
    const temp = current.position;
    current.position = below.position;
    below.position = temp;

    // Reorder the array
    collections.value.splice(index, 2, below, current);
  }
};

const saveSettings = async () => {
  try {
    const updatedCollections = collections.value.map((collection, index) => ({
      id: collection.id,
      position: index + 1,
      name: collection.name,
      slug: collection.slug,
      organization_id: collection.organization_id,
    }));

    await collectionsStore.updateCollectionPositions(updatedCollections);

    const userId = authStore.id;
    if (!userId) {
      error.value = "User not authenticated.";
      return;
    }

    const updatedPreferences = {
      ...authStore.preferences,
      dashboard: { stats: selectedStats.value },
    };

    await authStore.updatePreferences(updatedPreferences);

    navigateTo("/dashboard");
    await collectionsStore.fetchCollectionsForCurrentOrg();
  } catch (err) {
    console.error("[Save Settings] Failed to save settings:", err);
    error.value = "Failed to save settings.";
  }
};

const cancelSettings = () => {
  navigateTo("/dashboard");
};
</script>
