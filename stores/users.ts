import { defineStore } from "pinia";

export interface User {
  id: string;
  name: string;
  created_at?: string;
  preferences?: Record<string, any>;
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

    // Get user dashboard preferences
    getUserDashboardPreferences: (state) => (id: string) => {
      const user = state.users.find((user) => user.id === id);
      return user?.preferences?.dashboard?.stats || [];
    },
  },

  actions: {
    // Fetch all users if not already loaded
    async fetchUsers() {
      const { $supabase } = useNuxtApp();

      if (this.users.length > 0) {
        return this.users;
      }

      this.isLoading = true;
      try {
        const { data, error } = await $supabase.from("users").select("*");
        if (error) throw error;

        this.users = data || [];
        console.log("[Debug] Users successfully fetched:", this.users);

        // Debug individual user preferences
        this.users.forEach((user) => {
          console.log("[Debug] User preferences:", user.id, user.preferences);
        });

        return this.users;
      } catch (err) {
        this.error = "Failed to fetch users.";
        console.error("[Debug] Fetch Users Error:", err);
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch a single user by ID
    async fetchUserById(id: string) {
      const { $supabase } = useNuxtApp();

      // Check if user is already cached
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

        if (data) {
          this.users.push(data); // Add the fetched user to the cache
        }
        return data;
      } catch (err) {
        this.error = `Failed to fetch user with ID ${id}.`;
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
