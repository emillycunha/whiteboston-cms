import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [] as { id: number; type: string; message: string }[],
  }),
  actions: {
    showNotification(type: string, message: string, duration = 9000) {
      const id = Date.now();
      this.notifications.push({ id, type, message });

      // Auto-remove notification after `duration`
      setTimeout(() => {
        this.removeNotification(id);
      }, duration);
    },
    removeNotification(id: number) {
      this.notifications = this.notifications.filter((n) => n.id !== id);
    },
  },
});
