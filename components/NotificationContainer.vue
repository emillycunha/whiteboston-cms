<template>
  <div
    aria-live="assertive"
    class="fixed inset-x-0 bottom-0 flex items-end px-4 py-6 pointer-events-none sm:items-start sm:p-6 z-50"
  >
    <div class="w-full flex flex-col space-y-4 items-center sm:items-end">
      <!-- Notification Item -->
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <slot :type="notification.type" name="icon">
                <!-- Heroicons -->
                <CheckCircleIcon
                  v-if="notification.type === 'success'"
                  class="h-6 w-6 text-green-500"
                />
                <XCircleIcon
                  v-else-if="notification.type === 'error'"
                  class="h-6 w-6 text-red-500"
                />
                <InformationCircleIcon v-else class="h-6 w-6 text-blue-500" />
              </slot>
            </div>
            <div class="ml-3 w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ notification.message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0">
              <button
                class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                @click="removeNotification(notification.id)"
              >
                <span class="sr-only">Close</span>
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNotificationStore } from "@/stores/notification";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

// Get notifications from the store
const notificationStore = useNotificationStore();
const notifications = computed(() => notificationStore.notifications);

// Function to remove a notification
const removeNotification = (id) => {
  notificationStore.removeNotification(id);
};
</script>
