import { defineStore } from "pinia";

export enum NotificationType {
  Success = "success",
  Error = "error",
  Info = "info",
  Warning = "warning",
}

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [] as Notification[],
    nextId: 1,
  }),

  actions: {
    showNotification(
      type: NotificationType,
      message: string,
      duration = 9000,
      clearType?: NotificationType
    ) {
      if (clearType) {
        this.notifications = this.notifications.filter(
          (n) => n.type !== clearType
        );
      }

      const id = this.nextId++;
      this.notifications.push({ id, type, message });

      setTimeout(() => {
        this.removeNotification(id);
      }, duration);
    },

    removeNotification(id: number) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    },
  },
});
