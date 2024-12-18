import { defineStore } from "pinia";
import { useNuxtApp } from "#app";

export interface Lead {
  id: number;
  org_id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  interest: string;
  assigned_to: string;
  notes: string;
  submitted_at: string;
  owner_id: number;
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
      const { $supabase } = useNuxtApp(); // Access Supabase client

      // Check if leads are stored in localStorage
      const cachedLeads = localStorage.getItem("leads");
      if (cachedLeads) {
        console.log("[Store] Using cached leads from localStorage.");
        this.leads = JSON.parse(cachedLeads);
        return;
      }

      this.showNoPostsMessage = false;
      this.error = null;
      this.isLoading = true;

      try {
        console.log("[Store] Fetching leads from Supabase...");
        const { data, error } = await $supabase.from("leads").select("*");

        if (error) throw new Error(error.message);

        console.log("[Store] Fetched leads from Supabase:", data);
        this.leads = data || [];
        localStorage.setItem("leads", JSON.stringify(this.leads));

        console.log("[Store] Leads successfully stored:", this.leads);
      } catch (err) {
        console.error("[Store] Error fetching leads:", err);
        this.error = "Failed to fetch leads. Please try again.";
      } finally {
        this.isLoading = false;
        console.log("[Store] Loading state set to false.");
      }
    },

    async fetchLeadById(id: number): Promise<Lead> {
      const { $supabase } = useNuxtApp();

      try {
        console.log(`[Store] Fetching lead with ID: ${id} from Supabase...`);

        const { data, error } = await $supabase
          .from("leads")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw new Error(error.message);
        if (!data) throw new Error(`Lead with ID ${id} not found.`);

        console.log(`[Store] Fetched lead with ID ${id}:`, data);
        return data;
      } catch (err) {
        console.error(`[Store] Error fetching lead with ID ${id}:`, err);
        throw new Error(err instanceof Error ? err.message : "Unknown error.");
      }
    },

    async updateLead(
      updatedLead: Partial<Lead> & { id: number }
    ): Promise<Lead | null> {
      const { $supabase } = useNuxtApp();

      try {
        console.log(
          `[Store] Updating lead with ID: ${updatedLead.id} in Supabase...`
        );

        const { data, error } = await $supabase
          .from("leads")
          .update(updatedLead)
          .eq("id", updatedLead.id)
          .select("*")
          .single();

        if (error) throw new Error(error.message);

        const index = this.leads.findIndex(
          (lead) => lead.id === updatedLead.id
        );
        if (index !== -1) {
          this.leads[index] = data;
          console.log(
            `[Store] Lead with ID ${updatedLead.id} updated locally.`
          );
        } else {
          console.warn(
            `[Store] Lead with ID ${updatedLead.id} not found in the store.`
          );
        }

        return data;
      } catch (err) {
        console.error(
          `[Store] Failed to update lead with ID ${updatedLead.id}:`,
          err
        );
        throw new Error("Failed to update the lead. Please try again.");
      }
    },
  },
});
