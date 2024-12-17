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
              <span class="font-semibold text-sm">{{ lead.name }}</span>
              <span class="mx-2 text-teal-400">•</span
              ><span class="text-sm font-medium text-gray-800">
                {{ formatDate(lead.submitted_at) }}</span
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useLeadsStore } from "@/stores/leads";
import { UserIcon } from "@heroicons/vue/24/solid";

const leads = ref([]);

const leadsStore = useLeadsStore();
onMounted(async () => {
  console.log("[Parent] Fetching leads...");
  if (process.client) {
    await leadsStore.fetchLeads();
    leads.value = leadsStore.leads;
    console.log("[Parent] leads after fetch:", leads.value);
  }
});

// Compute the latest 3 leads based on submission date
const latestLeads = computed(() => {
  return leads.value
    .slice()
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)) // Sort by date (descending)
    .slice(0, 5); // Take the first 3
});

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
