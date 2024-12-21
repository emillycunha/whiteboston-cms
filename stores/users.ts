import { defineStore } from "pinia";

export interface User {
  userId: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
  notes: string;
  organization: string;
}

// stores/users.ts
export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as Array<{
      id: number;
      name: string;
      email: string;
      role: string;
    }>,
    error: null as string | null,
    isLoading: false,
  }),
  actions: {
    async fetchUsers() {
      const { $supabase } = useNuxtApp();
      this.isLoading = true;
      try {
        const { data, error } = await $supabase.from("users").select("*");
        if (error) throw error;
        this.users = data || [];
      } catch (err) {
        this.error = "Failed to fetch users.";
      } finally {
        this.isLoading = false;
      }
    },
  },
});
