<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader title="WB Dashboard" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Card Welcome -->
      <div
        class="lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:row-span-2 bg-gradient-to-l from-teal-50 to-violet-50 p-4 shadow rounded-md"
      >
        <!-- Greeting and Date -->
        <h2 class="text-gray-700 text-xl">
          {{ greeting }}, {{ authStore.name }}
        </h2>
        <p class="text-teal-500 text-sm mt-1">{{ formattedDate }}</p>

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
          <DashboardStats
            v-for="stat in selectedStats"
            :key="stat"
            :collectionSlug="stat"
          />
        </div>
      </div>

      <!-- Post Section -->
      <div class="lg:col-start-1 lg:col-span-2 lg:row-span-3 lg:row-start-2">
        <RecentPosts />
      </div>

      <!-- Recent Leads -->
      <div
        class="lg:col-start-3 lg:col-span-1 lg:row-start-3 lg:row-end-6 lg:row-span-2"
      >
        <RecentLeads />
      </div>

      <!-- Card 5 Quick Links -->
      <div class="lg:col-start-1 lg:col-span-2 lg:row-span-1 lg:row-start-5">
        <!-- Statistics Section -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            class="bg-violet-500 p-4 stretch shadow rounded-md text-center text-white"
          >
            <p class="text based">Tips for Managing Leads</p>
          </div>
          <div
            class="bg-violet-500 p-4 shadow rounded-md text-center text-white"
          >
            <p class="text based">How to Write a Blog in Markdown</p>
          </div>
          <div
            class="bg-violet-500 p-4 shadow rounded-md text-center text-white"
          >
            <p class="text based">Frequently Asked Questions (FAQs)</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageHeader from "@/components/PageHeader.vue";
import RecentLeads from "@/components/RecentLeads.vue";
import RecentPosts from "@/components/RecentPosts.vue";
import DailyQuote from "@/components/DailyQuote.vue";
import DashboardStats from "@/components/DashboardStats.vue";

import {
  ListBulletIcon,
  DocumentTextIcon,
  UserIcon,
  ArrowRightIcon,
} from "@heroicons/vue/24/solid";

import { ref, computed, onMounted } from "vue";
import { useUsersStore } from "~/stores/users";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const usersStore = useUsersStore();

const selectedStats = ref([]);

onMounted(async () => {
  if (authStore.isAuthenticated) {
    // Fetch user metadata
    await authStore.fetchUserMetadata();
    console.log("[Test Page] User Metadata:", {
      id: authStore.id,
      email: authStore.email,
      name: authStore.name,
      role: authStore.role,
      darkmode: authStore.darkmode,
      org_id: authStore.org_id,
    });

    // Ensure users are loaded
    if (!usersStore.users.length) {
      await usersStore.fetchUsers();
    }

    // Fetch and assign user preferences
    const userId = authStore.id;
    if (userId) {
      selectedStats.value = usersStore.getUserDashboardPreferences(userId);
    }
  } else {
    console.warn("[Test Page] User is not authenticated.");
  }
});

// Get current date and time
const currentDate = new Date();
const hours = currentDate.getHours();

// Determine the greeting
const greeting = computed(() => {
  if (hours < 12) return "Good morning";
  if (hours < 18) return "Good afternoon";
  return "Good evening";
});

// Format today's date
const formattedDate = computed(() => {
  return currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});
</script>
