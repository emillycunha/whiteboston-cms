import { defineStore } from "pinia";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  user_id: number;
  assigned_to: number;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  resolved_at: string;
  organization: string;
}

export const useTicketsStore = defineStore("tickets", {
  state: () => ({
    tickets: [] as Ticket[],
    error: null as string | null,
    loading: false,
  }),

  actions: {},
});
