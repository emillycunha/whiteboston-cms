<template>
  <div class="px-1 md:px-6 py-4 space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Card Welcome -->
      <div class="lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:row-span-2 bg-violet-50 dark:bg-slate-800 p-4 shadow rounded-md">
        <!-- Greeting and Date -->
        <DashboardGreeting />

        <!-- Profile Section -->
        <div class="my-4 border-t border-gray-500 pt-4">
          <!-- Quote of the Day -->
          <div>
            <DailyQuote />
          </div>
        </div>
      </div>

      <!-- Card Stats -->
      <div class="lg:col-start-1 lg:col-span-2 lg:row-span-1 lg:row-start-1">
        <div class="flex flex-row gap-x-2">
          <DashboardStats v-for="stat in selectedStats" :key="stat" :collectionSlug="stat" />
        </div>
      </div>

      <!-- Post Section -->
      <div class="lg:col-start-1 lg:col-span-2 lg:row-span-3 lg:row-start-2">
        <RecentCardOne />
      </div>

      <!-- Recent Leads -->
      <div class="lg:col-start-3 lg:col-span-1 lg:row-start-3 lg:row-end-6 lg:row-span-2">
        <RecentCardTwo />
      </div>

      <!-- Card 5 Quick Links -->
      <div class="lg:col-start-1 lg:col-span-2 lg:row-span-1 lg:row-start-5">
        <!-- Statistics Section -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-violet-500 p-4 stretch shadow rounded-md text-center text-white">
            <p class="text based">Tips for Managing Leads</p>
          </div>
          <div class="bg-violet-500 p-4 shadow rounded-md text-center text-white">
            <p class="text based">How to Write a Blog in Markdown</p>
          </div>
          <div class="bg-violet-500 p-4 shadow rounded-md text-center text-white">
            <p class="text based">Frequently Asked Questions (FAQs)</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
//import { ref, onMounted } from "vue";

const authStore = useAuthStore();
const selectedStats = ref([]);

onMounted(async () => {
  if (authStore.isAuthenticated) {
    console.log("[Mounted] User is authenticated.");
    await authStore.fetchUserMetadata();

    const dashboardStats = authStore.preferences?.dashboard?.stats || [];
    selectedStats.value = dashboardStats;
  } else {
    console.warn("[Mounted] User is not authenticated.");
  }
});
</script>
