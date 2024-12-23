import { defineStore } from "pinia";

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export const useOrganizationsStore = defineStore("organizations", {
  state: () => ({
    organizations: [] as Organization[], // Cached organizations
    error: null as string | null, // Error message
    isLoading: false, // Loading state
  }),
  getters: {
    getOrganizationById: (state) => (id: string) =>
      state.organizations.find((org) => org.id === id), // Find cached org by ID
  },
  actions: {
    // Fetch all organizations (Super Admin access)
    async fetchAllOrganizations() {
      const { $supabase } = useNuxtApp();

      // Avoid fetching if data is already cached
      if (this.organizations.length > 0) {
        return this.organizations;
      }

      this.isLoading = true;
      try {
        const { data, error } = await $supabase
          .from("organizations")
          .select("*");
        if (error) throw error;

        this.organizations = data || [];
        return this.organizations;
      } catch (err) {
        this.error = "Failed to fetch organizations.";
        console.error(
          "[Organizations Store] Error fetching all organizations:",
          err
        );
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch a single organization by ID
    async fetchOrganizationById(id: string) {
      const { $supabase } = useNuxtApp();

      const cachedOrg = this.getOrganizationById(id);
      if (cachedOrg) {
        return cachedOrg;
      }

      this.isLoading = true;
      try {
        const { data, error } = await $supabase
          .from("organizations")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;

        if (data) {
          this.organizations.push(data); // Cache the organization
        }
        return data;
      } catch (err) {
        this.error = `Failed to fetch organization with ID ${id}.`;
        console.error(
          "[Organizations Store] Error fetching organization by ID:",
          err
        );
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // Clear cache
    clearOrganizations() {
      console.log("[Organizations Store] Clearing organization cache.");
      this.organizations = [];
    },
  },
});
