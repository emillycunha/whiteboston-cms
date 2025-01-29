<template>
  <section class="bg-white dark:bg-slate-800 shadow rounded-md overflow-hidden h-full p-4">
    <div>
      <h2 class="mx-4 py-2 border-b border-gray-200 font-bold text-gray-700 dark:text-white">Recent {{ collectionName }}</h2>
      <ul v-if="latestContent.length > 0" class="mt-2 p-4 space-y-8">
        <li v-for="item in latestContent" :key="item.id" class="text-sm text-gray-700 dark:text-white">
          <div class="flex items-top">
            <div class="mr-4 bg-teal-500 rounded-lg p-2 flex items-center">
              <component :is="getIcon(collectionSlug)" class="size-6 text-white" aria-hidden="true" />
            </div>
            <div class="flex flex-col wrap">
              <!-- Dynamically Render Top 2 Fields -->
              <template v-for="(field, index) in topFields">
                <span class="font-semibold" v-if="index === 0">
                  {{ extractField(item, field) || "Untitled" }} |
                  <span class="text-xs text-teal-500">{{ formatDate(item.created_at) }}</span>
                </span>
                <span v-else>{{ extractField(item, field) || "N/A" }}</span>
              </template>
            </div>
          </div>
        </li>
      </ul>
      <!-- No Collections Note -->
      <div v-else class="mt-4 p-4 rounded-md text-center text-gray-700 dark:text-gray-300">
        <p>No data available.</p>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useContentStore } from "~/stores/content";
import { getIconForSlug } from "@/utils/iconMappings";

const authStore = useAuthStore();
const contentStore = useContentStore();
const content = ref([]);
const fields = ref([]);
const topFields = ref([]);
const collectionSlug = ref("");
const collectionName = computed(() => {
  return collectionSlug.value.charAt(0).toUpperCase() + collectionSlug.value.slice(1);
});

// Fetch content on mount
onMounted(async () => {
  try {
    const userPreferences = authStore.preferences?.dashboard?.recentCards || {};
    const cardTwoSlug = userPreferences.cardtwo?.[0] || "leads";
    collectionSlug.value = cardTwoSlug;

    await contentStore.fetchContentAndFields(collectionSlug.value);

    content.value = contentStore.content[collectionSlug.value] || [];
    fields.value = contentStore.fields[collectionSlug.value] || [];

    topFields.value = fields.value.slice(0, 2).map((field) => field.name);
  } catch (error) {
    console.error("[Mounted] Error fetching content and fields:", error);
  }
});

const getIcon = (collectionSlug) => {
  return getIconForSlug(collectionSlug);
};

// Compute the latest content based on submission date
const latestContent = computed(() => {
  return content.value
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);
});

// Extract field value dynamically
const extractField = (item, fieldName) => {
  return item.data?.[fieldName] || null;
};

// Format date for display
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleString("en-US", options);
};
</script>
