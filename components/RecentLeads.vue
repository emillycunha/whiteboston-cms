<template>
  <section class="bg-white shadow rounded-md overflow-hidden h-full">
    <div class="">
      <h2 class="px-4 py-2 bg-gray-200 font-bold text-gray-800">
        Recent Leads
      </h2>
      <ul class="p-4 space-y-5">
        <li
          v-for="lead in latestLeads"
          :key="lead.id"
          class="text-sm text-gray-800"
        >
          <span class="font-semibold">{{ lead.name }}</span>
          <span class="mx-2 text-teal-400">•</span>
          <span>{{ lead.interest }}</span>
          <span class="mx-2 text-teal-400">•</span>
          <span>{{ formatDate(lead.submitted_at) }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useLeadsStore } from "@/stores/leads";

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
