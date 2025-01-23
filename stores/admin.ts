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
    error: null as string | null,
    isLoading: false,
  }),
  getters: {
    // Get a user by ID
    getUserById: (state) => (id: string) =>
      state.users.find((user) => user.id === id),
  },

  actions: {
    // Fetch all users in the organization
    async fetchOrgUsers() {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const organizationId = authStore.org_id;
      const currentUserId = authStore.id;

      if (authStore.role !== "admin") {
        this.error = "You do not have permission to view users.";
        return [];
      }

      if (!authStore.canManage) {
        this.error = "You do not have permission to view users.";
        return [];
      }

      if (this.users.length > 0) {
        console.log("[Cache] Returning cached users.");
        return this.users;
      }

      // Check if organization ID is available
      if (!organizationId) {
        this.error = "Organization ID is missing.";
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
        //.neq("id", currentUserId)

        if (usersError) throw usersError;

        this.users = users.map((user) => ({
          ...user,
          role: userRoles[user.id],
        }));

        return this.users;
      } catch (err) {
        this.error = "Failed to fetch users.";
        console.error("[Debug] Fetch Users Error:", err);
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUserById(id: string) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const organizationId = authStore.org_id;

      if (!authStore.canManage) {
        this.error = "You do not have permission to view users.";
        return [];
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
            // Map the role and created_at (joined date) to the user data
            data.role = orgMemberData.role;
            data.created_at = orgMemberData.created_at; // Joined date

            // Add the user data to the cache
            this.users.push(data);
          }
          return data;
        } else {
          this.error = `User does not belong to the current organization.`;
          return null;
        }
      } catch (err) {
        this.error = `Failed to fetch user with ID ${id} in the current organization.`;
        console.error(err);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // Clear the users cache (e.g., on logout)
    clearUsers() {
      this.users = [];
    },
  },
});
