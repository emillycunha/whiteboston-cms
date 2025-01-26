import { defineStore } from "pinia";

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export const useOrganizationsStore = defineStore("organizations", {
  state: () => ({
    organizations: [] as Organization[],
    isLoading: false,
  }),
  getters: {
    getOrganizationById: (state) => (id: string) =>
      state.organizations.find((org) => org.id === id),
  },
  actions: {
    async checkPermissions(
      permission: keyof (typeof permissions)["SuperAdmin"]
    ) {
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      const rolePermissions = permissions[authStore.role || "none"];
      const hasPermission = rolePermissions?.[permission];

      if (!hasPermission) {
        const message = `You do not have permission to ${permission
          .replace(/^can/, "")
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()
          .trim()}.`;

        notificationStore.showNotification(NotificationType.Error, message);

        return false;
      }

      return true;
    },

    async fetchAllOrganizations() {
      const { $supabase } = useNuxtApp();
      const notificationStore = useNotificationStore();

      if (this.organizations.length > 0) {
        return this.organizations;
      }

      this.isLoading = true;
      try {
        const { data, error } = await $supabase
          .from("organizations")
          .select("*");
        if (error) {
          notificationStore.showNotification(
            NotificationType.Error,
            "Failed to fetch organizations. Please try again later."
          );
          return [];
        }

        this.organizations = data || [];
        return this.organizations;
      } catch (err) {
        console.error(
          "[Organizations Store] Error fetching all organizations:",
          err
        );
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while fetching organizations."
        );
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchOrganizationById(id: string) {
      const { $supabase } = useNuxtApp();
      const notificationStore = useNotificationStore();

      const cachedOrg = this.getOrganizationById(id);
      if (cachedOrg) {
        return cachedOrg;
      }

      this.isLoading = true;
      try {
        const { data, error } = await $supabase
          .from("organizations")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          notificationStore.showNotification(
            NotificationType.Error,
            `Failed to fetch organization with ID ${id}. Please try again later.`
          );
          return null;
        }

        if (data) {
          this.organizations.push(data);
        }
        return data;
      } catch (err) {
        console.error(
          "[Organizations Store] Error fetching organization by ID:",
          err
        );
        notificationStore.showNotification(
          NotificationType.Error,
          `An unexpected error occurred while fetching organization with ID ${id}.`
        );
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    clearOrganizations() {
      console.log("[Organizations Store] Clearing organization cache.");
      this.organizations = [];
    },
  },
});
