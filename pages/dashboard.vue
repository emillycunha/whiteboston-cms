<template>
  <div class="p-6 space-y-10">
    <!-- Header Section -->
    <PageHeader title="WB Dashboard" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Card Welcome -->
      <div
        class="lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:row-span-2 bg-gradient-to-l from-teal-50 to-violet-50 p-4 shadow rounded-md"
      >
        <!-- Greeting and Date -->
        <h2 class="text-gray-700 text-xl">{{ greeting }}, {{ userName }}</h2>
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
                class="bg-violet-500 text-white p-2 w-12 h-12 rounded flex items-center justify-center"
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
                class="bg-violet-500 text-white p-2 w-12 h-12 rounded flex items-center justify-center"
              >
                <DocumentTextIcon class="size-7" />
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
                class="bg-violet-500 text-white p-2 w-12 h-12 rounded flex items-center justify-center"
              >
                <ListBulletIcon class="size-7" />
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
import {
  ListBulletIcon,
  DocumentTextIcon,
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

// Placeholder for user profile information
const userName = ref("Emilly");
</script>
