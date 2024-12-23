<template>
  <section class="bg-white shadow rounded-md overflow-hidden h-full p-4">
    <div class="">
      <h2 class="mx-4 py-2 border-b border-gray-200 font-bold text-gray-800">
        Recent Leads
      </h2>
      <ul class="mt-2 p-4 space-y-6">
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
                {{ lead.name || "Unnamed Lead" }}
              </span>
              <span class="mx-2 text-teal-400">•</span>
              <span class="text-sm font-medium text-gray-800">
                {{ formatDate(lead.created_at) }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useContentStore } from "~/stores/content";
import { UserIcon } from "@heroicons/vue/24/solid";

// Define the slug for leads collection
const collectionSlug = "leads";

// Content store
const contentStore = useContentStore();
const content = ref([]);

// Fetch leads content on mount
onMounted(async () => {
  if (process.client) {
    try {
      await contentStore.fetchContentAndFields(collectionSlug);
      content.value = contentStore.content; // Fetches content with created_at
    } catch (error) {}
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
    .slice(0, 5);
});

// Format `created_at` date for display
const formatDate = (dateString) => {
  if (!dateString) {
    return "Unknown Date"; // Provide a fallback date string
  }
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleString("en-US", options);
};
</script>
