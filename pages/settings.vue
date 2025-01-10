<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader
      title="Settings"
      :buttons="[
        {
          label: 'Manage Collections',
          icon: Cog6ToothIcon,
          iconPosition: 'after',
          variant: 'secondary',
          onClick: manageCollections,
        },
        {
          label: 'Add',
          icon: PlusIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: addNew,
        },
      ]"
    />

    <div
      class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700"
    >
      <div
        v-if="collections.length > 0"
        class="p-4 sm:p-8 flex flex-row gap-x-16"
      >
        <!-- Sidebar Order -->
        <div class="p-2">
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
                  @click="moveUp(index)"
                  :disabled="index === 0"
                  class="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  ▲
                </button>

                <!-- Move Down -->
                <button
                  @click="moveDown(index)"
                  :disabled="index === collections.length - 1"
                  class="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  ▼
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
          <div>
            <!-- Other settings -->
            <button
              @click="clearSelection"
              class="px-3 py-2 bg-red-500 text-white rounded"
            >
              Clear Selection
            </button>
            <p v-if="error" class="text-red-500">{{ error }}</p>
          </div>
          <div>
            <div class="mt-4 space-y-2 border border-gray-200 rounded-md p-4">
              <div
                v-for="collection in availableCollections"
                :key="collection"
                class="flex items-center space-x-3"
              >
                <input
                  type="checkbox"
                  :id="collection"
                  :value="collection"
                  v-model="selectedStats"
                  @change="handleCheckboxChange(collection)"
                  class="h-4 w-4 text-violet-500 border-gray-300 rounded focus:ring-violet-500"
                />
                <label
                  :for="collection"
                  class="text-gray-700 dark:text-white font-medium"
                >
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
          <a href="/collections" class="text-violet-500 underline"
            >Collections Page</a
          >.
        </p>
      </div>

      <!-- Error Message -->
      <div class="flex justify-end p-6">
        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>
      </div>
    </div>

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
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useUsersStore } from "~/stores/users";
import { useCollectionsStore } from "~/stores/collections";

import {
  ChevronLeftIcon,
  CheckCircleIcon,
  PlusIcon,
  Cog6ToothIcon,
} from "@heroicons/vue/24/outline";

import { useNotificationStore } from "@/stores/notification";
const notificationStore = useNotificationStore();

// Store references
const authStore = useAuthStore();
const usersStore = useUsersStore();
const collectionsStore = useCollectionsStore();

// Reactive state
const availableCollections = ref([]);
const selectedStats = ref([]);

const clearSelection = () => {
  selectedStats.value = [];
  error.value = "";
};

const collections = ref([]);

const error = ref("");

onMounted(async () => {
  // Fetch collections dynamically based on the organization
  const orgId = authStore.org_id;
  if (!orgId) {
    return;
  }

  // Fetch collections for the organization
  await collectionsStore.fetchCollectionsForCurrentOrg();
  collections.value = collectionsStore.collections;

  availableCollections.value = collectionsStore
    .getCollectionsByOrg(orgId)
    .map((collection) => collection.slug);

  // Fetch user preferences
  const userId = authStore.id;
  if (userId) {
    await usersStore.fetchUsers();
    const userPreferences = usersStore.getUserDashboardPreferences(userId);
    selectedStats.value = userPreferences;
  }
});

// Handle checkbox changes and enforce max limit
const handleCheckboxChange = (collection) => {
  if (selectedStats.value.length > 3) {
    // Prevent exceeding limit
    selectedStats.value = selectedStats.value.filter(
      (item) => item !== collection
    );
    alert("You can select a maximum of 3 collections.");
  }
};

// Move an item up
const moveUp = (index) => {
  if (index > 0) {
    const current = collections.value[index];
    const above = collections.value[index - 1];

    // Swap positions
    const temp = current.position;
    current.position = above.position;
    above.position = temp;

    // Reorder the array
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
    // Save Positions
    const updatedCollections = collections.value.map((collection, index) => ({
      id: collection.id,
      position: index + 1,
      name: collection.name,
      slug: collection.slug,
      organization_id: collection.organization_id,
    }));

    await collectionsStore.updateCollectionPositions(updatedCollections);

    // Save Preferences
    const userId = authStore.id;
    if (!userId) {
      error.value = "User not authenticated.";
      return;
    }

    const currentPreferences =
      usersStore.getUserById(userId)?.preferences || {};

    currentPreferences.dashboard = { stats: selectedStats.value };

    const success = await usersStore.updateUserPreferences(
      userId,
      currentPreferences
    );

    if (success) {
      console.log(
        "[Save Settings] Dashboard preferences updated successfully."
      );

      // Show success notification
      notificationStore.showNotification(
        "success",
        "Settings saved successfully!"
      );

      // Redirect to collections
      navigateTo("/dashboard");

      // Refresh the page to update sidebar and other components
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      error.value = "Failed to update dashboard preferences.";
    }
  } catch (err) {
    console.error("[Save Settings] Failed to save settings:", err);
    error.value = "Failed to save settings.";
  }
};

const cancelSettings = () => {
  navigateTo("/dashboard");
};

const addNew = () => {
  navigateTo({ path: `/collections/new/add/collection` });
};

const manageCollections = () => {
  navigateTo({ path: "/collections" });
};
</script>
