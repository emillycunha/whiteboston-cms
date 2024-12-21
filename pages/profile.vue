<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Profile" />
    <div
      class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700"
    >
      <div class="p-2 sm:p-10">
        <form class="flex flex-col gap-y-6 p-4 sm:p-10">
          <!-- Name -->
          <div>
            <label
              class="block text-base font-semibold text-gray-700 dark:text-gray-300"
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
              class="block text-base font-semibold text-gray-700 dark:text-gray-300"
              >Email</label
            >
            <input
              v-model="authStore.email"
              type="email"
              placeholder="Enter your email"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              class="block text-base font-semibold text-gray-700 dark:text-gray-300"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              placeholder="Update your password"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
          </div>
        </form>

        <!-- Dark Mode Toggle -->
        <div class="flex flex-col gap-x-2 p-4 sm:px-10">
          <div
            class="flex flex-row border-t border-gray-200 dark:border-slate-700 py-4"
          >
            <p class="text-sm text-violet-500">Role: {{ authStore.role }} |</p>
            <p class="ml-2 text-sm text-violet-500">
              Organization ID: {{ authStore.org_id }}
            </p>
          </div>
        </div>
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
import DarkModeToggle from "@/components/DarkModeToggle.vue";
import { useAuthStore } from "~/stores/auth";
import { ChevronLeftIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();

// Fetch user metadata and log details on page load
onMounted(async () => {
  console.log("[Test Page] Auth Store State:", authStore.$state);

  if (authStore.isAuthenticated) {
    console.log("[Test Page] Fetching user metadata...");
    await authStore.fetchUserMetadata();
    console.log("[Test Page] User Metadata:", {
      id: authStore.id,
      email: authStore.email,
      role: authStore.role,
      darkmode: authStore.darkmode,
      org_id: authStore.org_id,
    });
  } else {
    console.warn("[Test Page] User is not authenticated.");
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
</script>
