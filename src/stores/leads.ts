import { defineStore } from "pinia";

export interface Lead {
  id: number;
  name: string;
  email: string | null;
  interest: string | null;
  submitted_at: string;
}

export const useLeadsStore = defineStore("leads", {
  state: () => ({
    leads: [] as Lead[],
    error: null as string | null,
    loading: false,
  }),
  actions: {
    // Fetch all leads from local JSON file
    async fetchLeads() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch("/data/leads.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch leads: ${response.statusText}`);
        }
        const data: Lead[] = await response.json();
        this.leads = data || [];
      } catch (e) {
        this.error =
          e instanceof Error ? e.message : "An unknown error occurred.";
        this.leads = [];
      } finally {
        this.loading = false;
      }
    },

    // Fetch a single lead by ID from local data
    async fetchLeadById(id: number): Promise<Lead | null> {
      this.error = null;

      try {
        const lead = this.leads.find((lead) => lead.id === id);
        if (!lead) {
          throw new Error("Lead not found.");
        }
        return lead;
      } catch (e) {
        this.error =
          e instanceof Error ? e.message : "An unknown error occurred.";
        return null;
      }
    },
  },
});
