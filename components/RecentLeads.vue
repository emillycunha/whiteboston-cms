<template>
  <section class="bg-white shadow rounded-md overflow-hidden h-full p-4">
    <div class="">
      <h2 class="mx-4 py-2 border-b border-gray-200 font-bold text-gray-800">
        Recent Leads
      </h2>
      <ul v-if="content.length > 0" class="mt-2 p-4 space-y-6">
        <li
          v-for="lead in latestLeads"
          :key="lead.id"
          class="text-sm text-gray-800"
        >
          <div class="flex items-center">
            <div class="mr-4 p-1">
              <UserIcon class="size-5 text-teal-500" />
            </div>
            <div class="inline-block">
              <span class="font-semibold text-sm">
                {{ lead.Name || "Unnamed Lead" }}
              </span>
              <span class="mx-2 text-teal-400">•</span>
              <span class="text-sm font-medium text-gray-800">
                {{ formatDate(lead.created_at) }}
              </span>
            </div>
          </div>
        </li>
      </ul>
      <!-- No Collections Note -->
      <div
        v-else
        class="mt-4 p-4 rounded-md text-center text-gray-600 dark:text-gray-300"
      >
        <p>No data available.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useContentStore } from "~/stores/content";
import { UserIcon } from "@heroicons/vue/24/solid";

// Define the slug for the leads collection
const collectionSlug = "leads";

// Content store
const contentStore = useContentStore();
const content = ref([]);
const collectionFound = ref(false);

// Fetch content on mount
onMounted(async () => {
  try {
    const collectionData = await contentStore.fetchContentAndFields(
      collectionSlug
    );
    if (collectionData) {
      content.value = contentStore.content;
      collectionFound.value = true;
    } else {
      console.warn("[Warning] Collection not found for slug:", collectionSlug);
      collectionFound.value = false;
    }
  } catch (error) {
    console.error("[Error Fetching Content]:", error);
    collectionFound.value = false;
  }
});

// Compute the latest leads based on `created_at`
const latestLeads = computed(() => {
  return content.value
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    })
    .slice(0, 4);
});

// Format `created_at` date for display
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleString("en-US", options);
};
</script>
