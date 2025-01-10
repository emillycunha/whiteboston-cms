<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold mb-4">Notification Demo</h1>

    <div class="space-x-4">
      <!-- Success Notification Button -->
      <button
        @click="showSuccess"
        class="px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Show Success
      </button>

      <!-- Error Notification Button -->
      <button
        @click="showError"
        class="px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Show Error
      </button>

      <!-- Info Notification Button -->
      <button
        @click="showInfo"
        class="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Show Info
      </button>
    </div>

    <!-- The NotificationContainer is assumed to be included in the layout -->
  </div>
</template>

<script setup>
import { useNotificationStore } from "@/stores/notification";

// Access the notification store
const notificationStore = useNotificationStore();

// Methods to trigger different types of notifications
const showSuccess = () => {
  notificationStore.showNotification(
    "success",
    "Data saved successfully! I need to extend this to see how the nofitication looks like when it is long."
  );
};

const showError = () => {
  notificationStore.showNotification("error", "Failed to save data.");
};

const showInfo = () => {
  notificationStore.showNotification(
    "info",
    "This is an informational message."
  );
};
</script>
