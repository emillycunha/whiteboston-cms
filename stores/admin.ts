import { defineStore } from "pinia";

export interface User {
  id: string;
  name: string;
  created_at?: string;
  preferences?: Record<string, any>;
  role: string;
}

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as User[],
    isLoading: false,
  }),
  getters: {
    getUserById: (state) => (id: string) =>
      state.users.find((user) => user.id === id),
  },
  actions: {
    async fetchOrgUsers() {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();
      const organizationId = authStore.org_id;

      if (authStore.role !== "admin" || !authStore.canManage) {
        notificationStore.showNotification(
          NotificationType.Error,
          "You do not have permission to view users."
        );
        return [];
      }

      if (this.users.length > 0) {
        console.log("[Cache] Returning cached users.");
        return this.users;
      }

      if (!organizationId) {
        notificationStore.showNotification(
          NotificationType.Error,
          "Organization ID is missing."
        );
        return [];
      }

      this.isLoading = true;

      try {
        const { data: members, error: membersError } = await $supabase
          .from("organization_members")
          .select("user_id, role")
          .eq("organization_id", organizationId);

        if (membersError) throw membersError;

        const userRoles: { [key: string]: string } = {};
        members.forEach((member) => {
          userRoles[member.user_id] = member.role;
        });

        const userIds = members.map((member) => member.user_id);

        const { data: users, error: usersError } = await $supabase
          .from("users")
          .select("*")
          .in("id", userIds)
          .order("name", { ascending: true });

        if (usersError) throw usersError;

        this.users = users.map((user) => ({
          ...user,
          role: userRoles[user.id],
        }));

        return this.users;
      } catch (err) {
        console.error("[Debug] Fetch Users Error:", err);
        notificationStore.showNotification(
          NotificationType.Error,
          "Failed to fetch users. Please try again later."
        );
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUserById(id: string) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();
      const organizationId = authStore.org_id;

      if (!authStore.canManage) {
        notificationStore.showNotification(
          NotificationType.Error,
          "You do not have permission to view users."
        );
        return null;
      }

      const cachedUser = this.getUserById(id);
      if (cachedUser) {
        return cachedUser;
      }

      this.isLoading = true;

      try {
        const { data, error } = await $supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        const { data: orgMemberData, error: orgMemberError } = await $supabase
          .from("organization_members")
          .select("organization_id, role, created_at")
          .eq("user_id", id)
          .single();

        if (orgMemberError) throw orgMemberError;

        if (orgMemberData && orgMemberData.organization_id === organizationId) {
          if (data) {
            data.role = orgMemberData.role;
            data.created_at = orgMemberData.created_at;

            this.users.push(data);
          }
          return data;
        } else {
          notificationStore.showNotification(
            NotificationType.Error,
            "User does not belong to the current organization."
          );
          return null;
        }
      } catch (err) {
        console.error(err);
        notificationStore.showNotification(
          NotificationType.Error,
          `Failed to fetch user with ID ${id}. Please try again later.`
        );
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    clearUsers() {
      this.users = [];
    },
  },
});
