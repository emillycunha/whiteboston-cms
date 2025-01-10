<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Profile" />
    <div
      class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700"
    >
      <div class="p-4 sm:p-8">
        <form class="">
          <div class="flex flex-wrap gap-y-4">
            <!-- Name -->
            <div class="w-1/2 p-2">
              <label
                class="block text-base font-semibold text-gray-700 dark:text-gray-300"
                >Name</label
              >
              <input
                v-model="authStore.name"
                type="text"
                :disabled="authStore.isDemoUser"
                placeholder="Enter your name"
                class="mt-1 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <!-- Email -->
            <div class="w-full p-2">
              <label
                class="block text-base font-semibold text-gray-700 dark:text-gray-300"
                >Email</label
              >
              <input
                v-model="authStore.email"
                type="email"
                :disabled="authStore.isDemoUser"
                placeholder="Enter your email"
                class="mt-1 w-1/2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <!-- Password -->
            <div class="w-full p-2">
              <label
                class="block text-base font-semibold text-gray-700 dark:text-gray-300"
                >Password</label
              >
              <input
                v-model="password"
                type="password"
                :disabled="authStore.isDemoUser"
                placeholder="Update your password"
                class="mt-1 w-1/2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>
        </form>
      </div>
    </div>

    <PageFooter
      title=""
      :buttons="[
        {
          label: 'Back',
          icon: ChevronLeftIcon,
          iconPosition: 'before',
          variant: 'secondary',
          onClick: cancelProfile,
        },
        {
          label: 'Save Profile',
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
import { onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { ChevronLeftIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
if (authStore.isDemoUser) {
  console.log("This user is a demo user!");
}

// Fetch user metadata and log details on page load
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await authStore.fetchUserMetadata();
  } else {
  }
});

function cancelProfile() {
  console.log("Settings changes discarded.");
  alert("Settings reset!");
}

function saveProfile() {
  console.log("Profile saved:", {});
  alert("Profile saved successfully!");
}

const password = ref("");
</script>
