import { defineStore } from "pinia";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  interest: string;
  submitted_at: string;
}

export const useLeadsStore = defineStore("leads", {
  state: () => ({
    leads: [] as Lead[],
    error: null as string | null,
    showNoPostsMessage: false,
    isLoading: false,
  }),
  actions: {
    async fetchLeads() {
      // Check if leads are stored in localStorage
      const cachedleads = localStorage.getItem("leads");
      if (cachedleads) {
        console.log("[Store] Using cached leads from localStorage.");
        this.leads = JSON.parse(cachedleads);
        return;
      }

      this.showNoPostsMessage = false;
      this.error = null;
      this.isLoading = true;

      try {
        console.log("[Store] Fetching leads from /api/leads...");
        const response = await $fetch<Lead[]>("/api/leads");
        console.log("[Store] Fetched leads:", response);
        this.leads = response;
        localStorage.setItem("leads", JSON.stringify(response));

        console.log("[Store] leads successfully stored:", this.leads);
      } catch (err) {
        console.error("[Store] Error fetching leads:", err);
        this.error = "Failed to fetch leads. Please try again.";
      } finally {
        this.isLoading = false;
        console.log("[Store] Loading state set to false.");
      }
    },

    async fetchLeadById(id: number): Promise<Lead> {
      try {
        console.log(
          `[Store] Fetching lead with ID: ${id} from /api/leads/${id}...`
        );

        // Fetch the lead by ID from the API
        const response = await $fetch<Lead>(`/api/leads/${id}`);

        console.log(`[Store] Fetched lead with ID: ${id}:`, response);

        if (!response) {
          throw new Error(`Lead with ID ${id} not found.`);
        }

        return response;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error(`[Store] Error fetching lead with ID: ${id}:`, message);
        throw new Error(message);
      }
    },

    async updateLead(
      updatedLead: Partial<Lead> & { id: number }
    ): Promise<Lead | null> {
      const index = this.leads.findIndex((lead) => lead.id === updatedLead.id);
      if (index !== -1) {
        this.leads[index] = { ...this.leads[index], ...updatedLead };

        // Simulate saving changes to local file or mock backend
        console.log(`Updated lead with id ${updatedLead.id}`);
        return this.leads[index];
      }

      return null;
    },
  },
});
