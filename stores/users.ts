import { defineStore } from "pinia";

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
  notes: string;
  organization: string;
}

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as User[],
    error: null as string | null,
    loading: false,
  }),

  actions: {},
});
