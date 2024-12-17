import { defineStore } from "pinia";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  interest: string;
  assigned_to: string;
  notes: string;
  submitted_at: string;
  user_id: number;
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
      try {
        // Send updated lead to the backend API
        const response = await $fetch<Lead>(`/api/leads/${updatedLead.id}`, {
          method: "PUT",
          body: updatedLead, // Send only updated fields
        });

        // Update the local store with the updated lead
        const index = this.leads.findIndex(
          (lead) => lead.id === updatedLead.id
        );
        if (index !== -1) {
          this.leads[index] = response;
          console.log(`Updated lead with ID ${updatedLead.id} in the store.`);
        } else {
          console.warn(
            `Lead with ID ${updatedLead.id} not found in the store.`
          );
        }

        return response;
      } catch (err) {
        console.error(`Failed to update lead with ID: ${updatedLead.id}`, err);
        throw new Error("Failed to update the lead. Please try again.");
      }
    },
  },
});
