<template>
  <div class="px-1 md:px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Settings" />

    <div class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
      <div v-if="collections.length > 0" class="p-4 sm:p-8 flex flex-col gap-y-6">
        <!-- Sidebar Order -->
        <div class="p-2">
          <h3 class="text-base font-semibold">Sidebar Collections Order (Top 3)</h3>
          <p class="text-sm text-gray-700">Use the arrows to adjust the order of the top 3 collections displayed in the sidebar.</p>
          <p v-if="error" class="text-sm text-red-500 mt-2">{{ error }}</p>

          <!-- Sidebar Collections List -->
          <ul class="mt-4 space-y-2 border border-gray-200 rounded-md p-4">
            <li v-for="(collection, index) in sidebarOrder" :key="collection" class="flex items-center justify-between bg-white">
              <div>
                <span class="text-gray-700 dark:text-white font-medium">{{ index + 1 }}. {{ collection.name }}</span>
              </div>

              <!-- Arrow Buttons -->
              <div class="flex space-x-2">
                <!-- Move Up -->
                <button :disabled="index === 0" class="p-1 bg-violet-500 text-white rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed" @click="moveSidebarUp(index)">
                  <ChevronUpIcon class="h-4 w-4" />
                </button>

                <!-- Move Down -->
                <button :disabled="index === sidebarOrder.length - 1" class="p-1 bg-violet-500 text-white rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed" @click="moveSidebarDown(index)">
                  <ChevronDownIcon class="h-4 w-4" />
                </button>
              </div>
            </li>
          </ul>
        </div>

        <!-- Dashboard Stats -->
        <div class="p-2">
          <h3 class="font-bold text-base">Select Dashboard Stats</h3>
          <p class="text-sm text-gray-700">Choose up to 3 collections to display on the dashboard stats cards.</p>
          <p v-if="errors" class="text-sm text-red-500 mt-2">
            {{ errors.dashboardStats }}
          </p>

          <div class="flex justify-end">
            <button class="px-3 py-2 text-xs bg-violet-500 text-white rounded" @click="clearSelection">Clear Selection</button>
          </div>
          <div>
            <div class="mt-4 space-y-2 border border-gray-200 rounded-md p-4">
              <div v-for="collection in dashboardStats" :key="collection" class="flex items-center space-x-3">
                <label :for="collection" class="text-gray-700 dark:text-white font-medium has-checked:text-violet-500">
                  <input :id="collection" type="checkbox" :value="collection" :checked="collection.selected" class="h-4 w-4 accent-violet-500 dark:accent-teal-500" @change="handleStatsChange(collection)" />

                  {{ collection.name }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Dashboard Recent Cards -->
        <div class="p-2">
          <h3 class="font-bold text-base">Select Dashboard Recent Cards</h3>
          <p class="text-sm text-gray-700">Choose collections for recent cards (Card 1 and Card 2).</p>
          <p v-if="error" class="text-sm text-red-500 mt-2">{{ error }}</p>

          <div class="flex flex-row grow gap-x-16">
            <!-- Card One -->
            <div class="mt-6 flex-1">
              <h4 class="font-medium text-sm">Card One</h4>
              <div class="mt-4 space-y-2 border border-gray-200 rounded-md p-4">
                <div v-for="collection in recentCards.cardone" :key="collection.id" class="flex items-center space-x-3">
                  <label :for="`cardone_${collection.slug}`" class="text-gray-700 dark:text-white font-medium has-checked:text-violet-500">
                    <input :id="`cardone_${collection.slug}`" type="checkbox" :value="collection" :checked="collection.checked" class="h-4 w-4 accent-violet-500 dark:accent-teal-500" @change="handleCardOneChange(collection)" />
                    {{ collection.name }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Card Two -->
            <div class="mt-6 flex-1">
              <h4 class="font-medium text-sm">Card Two</h4>
              <div class="mt-4 space-y-2 border border-gray-200 rounded-md p-4">
                <div v-for="collection in recentCards.cardtwo" :key="collection.id" class="flex items-center space-x-3">
                  <label :for="`cardtwo_${collection.slug}`" class="text-gray-700 dark:text-white font-medium has-checked:text-violet-500">
                    <input :id="`cardtwo_${collection.slug}`" type="checkbox" :value="collection" :checked="collection.checked" class="h-4 w-4 accent-violet-500 dark:accent-teal-500" @change="handleCardTwoChange(collection)" />
                    {{ collection.name }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Collections Note -->
      <div v-else class="mt-4 p-4 rounded-md text-center text-gray-700 dark:text-gray-300">
        <p>No collections available.</p>
        <p>
          Add collections by navigating to the
          <NuxtLink href="/collections" class="text-violet-500 underline">Collections Page</NuxtLink>
          .
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
import { ChevronLeftIcon, CheckCircleIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const collectionsStore = useCollectionsStore();

const sidebarOrder = ref([]);
const dashboardStats = ref([]);
const recentCards = ref({
  cardone: [],
  cardtwo: [],
});

const collections = ref([]);
const selectedStats = ref([]);

const error = ref("");
const errors = ref({
  dashboardStats: "",
});
const initialPreferences = ref({});

// Clear selections
const clearSelection = () => {
  sidebarOrder.value = [];
  error.value = "";
};

onMounted(async () => {
  try {
    const orgId = authStore.org_id;
    if (!orgId) {
      return;
    }

    await collectionsStore.fetchCollectionsForCurrentOrg();
    collections.value = collectionsStore.collections;

    // Load user preferences
    const userPreferences = authStore.preferences || {};
    const dashboardPreferences = userPreferences.dashboard || {};

    // Clean up blanks in preferences
    const cleanedSidebarOrder = (dashboardPreferences.sidebarOrder || []).filter((slug) => slug !== "");

    const cleanedStats = (dashboardPreferences.stats || []).filter((slug) => slug !== "");

    const cleanedRecentCardOne = (dashboardPreferences.recentCards?.cardone || []).filter((slug) => slug !== "");

    const cleanedRecentCardTwo = (dashboardPreferences.recentCards?.cardtwo || []).filter((slug) => slug !== "");

    // Initialize sidebar order (user preferences first, then remaining collections)
    sidebarOrder.value = [...collections.value.filter((collection) => cleanedSidebarOrder.includes(collection.slug)), ...collections.value.filter((collection) => !cleanedSidebarOrder.includes(collection.slug))];

    // Initialize dashboard stats
    dashboardStats.value = collections.value.map((collection) => ({
      ...collection,
      selected: cleanedStats.includes(collection.slug), // Mark as selected if in DB preferences
    }));

    // Ensure only two stats are selected
    if (dashboardStats.value.filter((item) => item.selected).length > 2) {
      let count = 0;
      dashboardStats.value.forEach((item) => {
        if (item.selected) {
          count++;
          if (count > 2) {
            item.selected = false; // Unselect extras
          }
        }
      });
    }

    // Sync selected stats to a separate ref for operations
    selectedStats.value = dashboardStats.value.filter((item) => item.selected);

    // Initialize recent cards (user preferences first, then all collections)
    recentCards.value = {
      cardone: collections.value.map((collection) => ({
        ...collection,
        checked: cleanedRecentCardOne.includes(collection.slug),
      })),
      cardtwo: collections.value.map((collection) => ({
        ...collection,
        checked: cleanedRecentCardTwo.includes(collection.slug),
      })),
    };
  } catch (err) {
    error.value = "Failed to load collections or preferences.";
    console.error("[onMounted] Error loading data:", err);
  }
});

const moveSidebarUp = (index) => {
  if (index > 0) {
    const temp = sidebarOrder.value[index];
    sidebarOrder.value[index] = sidebarOrder.value[index - 1];
    sidebarOrder.value[index - 1] = temp;
  }
};

const moveSidebarDown = (index) => {
  if (index < sidebarOrder.value.length - 1) {
    const temp = sidebarOrder.value[index];
    sidebarOrder.value[index] = sidebarOrder.value[index + 1];
    sidebarOrder.value[index + 1] = temp;
  }
};

const cancelSettings = () => {
  navigateTo("/dashboard");
};

const handleStatsChange = (collection) => {
  const target = dashboardStats.value.find((item) => item.slug === collection.slug);

  if (!target) return;

  if (target.selected) {
    target.selected = false;
  } else {
    const selectedCount = dashboardStats.value.filter((item) => item.selected).length;

    if (selectedCount >= 2) {
      errors.value.dashboardStats = "You can select a maximum of 2 collections for stats.";
      return;
    }

    target.selected = true;
  }

  selectedStats.value = dashboardStats.value.filter((item) => item.selected);
  errors.value.dashboardStats = "";
};

const handleCardOneChange = (collection) => {
  recentCards.value.cardone.forEach((item) => {
    item.checked = item.slug === collection.slug;
  });
  console.log(`Selected ${collection.name} for card one`);
};

const handleCardTwoChange = (collection) => {
  recentCards.value.cardtwo.forEach((item) => {
    item.checked = item.slug === collection.slug; // Set true for selected, false for others
  });
  console.log(`Selected ${collection.name} for card two`);
};

const saveSettings = async () => {
  try {
    console.log("Extracting preferences to save...");

    // Extract top 3 collections for Sidebar Order
    const top3Collections = sidebarOrder.value.slice(0, 3).map((collection) => collection.slug);

    // Extract selected Dashboard Stats
    const selectedStatsSlugs = selectedStats.value.map((collection) => collection.slug);

    const cardOneCollections = recentCards.value.cardone.filter((collection) => collection.checked).map((collection) => collection.slug);

    const cardTwoCollections = recentCards.value.cardtwo.filter((collection) => collection.checked).map((collection) => collection.slug);

    // Determine if preferences have changed
    const preferencesChanged = JSON.stringify(initialPreferences.value.sidebarOrder) !== JSON.stringify(top3Collections) || JSON.stringify(initialPreferences.value.stats) !== JSON.stringify(selectedStatsSlugs) || JSON.stringify(initialPreferences.value.recentCards?.cardone) !== JSON.stringify(cardOneCollections) || JSON.stringify(initialPreferences.value.recentCards?.cardtwo) !== JSON.stringify(cardTwoCollections);

    console.log("Preferences changed:", preferencesChanged);

    if (preferencesChanged) {
      // Build updated preferences
      const updatedPreferences = {
        dashboard: {
          ...authStore.preferences.dashboard,
          sidebarOrder: top3Collections,
          stats: selectedStatsSlugs,
          recentCards: {
            cardone: cardOneCollections,
            cardtwo: cardTwoCollections,
          },
        },
      };

      console.log("Saving updated preferences:", updatedPreferences);

      // Save preferences
      const success = await authStore.updatePreferences(updatedPreferences);
      if (success) {
        // Update initial state to reflect saved preferences
        initialPreferences.value = {
          sidebarOrder: JSON.parse(JSON.stringify(top3Collections)),
          stats: JSON.parse(JSON.stringify(selectedStatsSlugs)),
          recentCards: {
            cardone: JSON.parse(JSON.stringify(cardOneCollections)),
            cardtwo: JSON.parse(JSON.stringify(cardTwoCollections)),
          },
        };

        console.log("Preferences saved successfully:", initialPreferences.value);
      }
    } else {
      console.log("No changes detected in preferences.");
    }
  } catch (err) {
    console.error("[Save Settings] Failed to save settings:", err);
    error.value = "Failed to save settings.";
  }
};
</script>
