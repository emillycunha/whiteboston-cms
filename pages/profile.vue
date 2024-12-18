<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Submit a Ticket" />
    <div
      class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700"
    >
      <div class="p-2 sm:p-4">
        <form class="flex flex-col gap-y-4 p-4 sm:p-10">
          <!-- Name -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Name</label
            >
            <input
              v-model="name"
              type="text"
              placeholder="Enter your name"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
          </div>

          <!-- Email -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Email</label
            >
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              placeholder="Update your password"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
          </div>

          <!-- Dark Mode Toggle -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Dark Mode</span
            >
            <DarkModeToggle />
          </div>
        </form>
      </div>
    </div>
    <PageFooter
      title=""
      :buttons="[
        {
          label: 'Cancel',
          icon: XCircleIcon,
          iconPosition: 'after',
          variant: 'secondary',
          onClick: cancelAdd,
        },
        {
          label: 'Publish Post',
          icon: CheckCircleIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: saveProfile,
        },
      ]"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import DarkModeToggle from "@/components/DarkModeToggle.vue";

const name = ref("John Doe");
const email = ref("john@example.com");
const password = ref("");

function saveProfile() {
  console.log("Profile saved:", {
    name: name.value,
    email: email.value,
    password: password.value,
  });
  alert("Profile saved successfully!");
}
</script>
