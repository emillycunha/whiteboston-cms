<template>
  <div class="p-6 space-y-10">
    <!-- Header Section -->
    <PageHeader title="WB Dashboard" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Card Welcome -->
      <div
        class="lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:row-span-2 bg-gradient-to-r from-teal-50 to-violet-100 p-4 shadow rounded-md"
      >
        <!-- Greeting and Date -->
        <h2 class="text-gray-500 text-xl">{{ greeting }}, {{ userName }}</h2>
        <p class="text-gray-700 text-sm">{{ formattedDate }}</p>

        <!-- Quote of the Day -->
        <p class="mt-4 text-base font-bold text-gray-500 italic">
          "{{ quoteOfTheDay }}"
        </p>

        <!-- Profile Section -->
        <div class="mt-4 border-t border-gray-500 pt-4">
          <p class="text-gray-700 text-base font-light">{{ profileSummary }}</p>

          <a
            href="#"
            class="mt-2 flex flex-row text-sm text-violet-500 hover:underline"
          >
            Edit Profile
            <ArrowRightIcon class="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      <!-- Card Stats -->
      <div class="lg:col-start-1 lg:col-span-2 lg:row-span-1 lg:row-start-1">
        <div class="grid grid-cols-1 gap-6">
          <!-- Statistics Section -->
          <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              class="bg-white p-4 shadow rounded-md flex items-center justify-between"
            >
              <div>
                <h2 class="text-gray-600">Contacts</h2>
                <p class="text-2xl font-bold">120</p>
              </div>
              <div
                class="bg-teal-100 text-violet-500 p-2 w-12 h-12 rounded flex items-center justify-center"
              >
                <UserIcon class="size-7" />
              </div>
            </div>
            <div
              class="bg-white p-4 shadow rounded-md flex items-center justify-between"
            >
              <div>
                <h2 class="text-gray-600">Posts</h2>
                <p class="text-2xl font-bold">12</p>
              </div>
              <div
                class="bg-teal-100 text-violet-500 p-2 w-12 h-12 rounded flex items-center justify-center"
              >
                <UserIcon class="size-7" />
              </div>
            </div>
            <div
              class="bg-white p-4 shadow rounded-md flex items-center justify-between"
            >
              <div>
                <h2 class="text-gray-600">Tasks</h2>
                <p class="text-2xl font-bold">2</p>
              </div>
              <div
                class="bg-teal-100 text-violet-500 p-2 w-12 h-12 rounded flex items-center justify-center"
              >
                <UserIcon class="size-7" />
              </div>
            </div>
          </section>
        </div>

        <!-- Post Seciton-->
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
            <div>
              <h2 class="">Contacts</h2>
              <p class="text-2xl font-bold">120</p>
              <p class="text-sm"></p>
            </div>
          </div>
          <div
            class="bg-violet-500 p-4 shadow rounded-md text-center text-white"
          >
            <div>
              <h2 class="">Contacts</h2>
              <p class="text-2xl font-bold">120</p>
              <p class="text-sm"></p>
            </div>
          </div>
          <div
            class="bg-violet-500 p-4 shadow rounded-md text-center text-white"
          >
            <div>
              <h2 class="">Contacts</h2>
              <p class="text-2xl font-bold">120</p>
              <p class="text-sm"></p>
            </div>
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
import {
  PencilSquareIcon,
  ChevronLeftIcon,
  UserIcon,
  ArrowRightIcon,
} from "@heroicons/vue/24/solid";

import { ref, computed } from "vue";

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

// Placeholder for motivational quote
const quoteOfTheDay = ref(
  "The only way to do great work is to love what you do. – Steve Jobs"
);

// Placeholder for user profile information
const userName = ref("Emilly");
const profileSummary = ref(
  "You're on track with your goals! Keep up the great work."
);
</script>

<style scoped>
/* Add any additional styling here if needed */
</style>
