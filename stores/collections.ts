import { defineStore } from "pinia";
import { useAuthStore } from "~/stores/auth";

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description?: string;
  organization_id: string;
  created_at: string;
}

export const useCollectionsStore = defineStore("collections", {
  state: () => ({
    collections: [] as Collection[],
    error: null as string | null,
    isLoading: false,
  }),
  getters: {
    getCollectionById: (state) => (id: number) =>
      state.collections.find((collection) => collection.id === id),
    getCollectionsByOrg: (state) => (orgId: string) =>
      state.collections.filter(
        (collection) => collection.organization_id === orgId
      ),
  },
  actions: {
    // Fetch all collections for the current user's organization
    async fetchCollectionsForCurrentOrg() {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();

      // Check if organization ID is available
      const organizationId = authStore.org_id;
      if (!organizationId) {
        console.error("[Collections Store] Organization ID is missing.");
        this.error = "Organization ID is missing.";
        return [];
      }

      // Avoid fetching if already cached
      if (this.getCollectionsByOrg(organizationId).length > 0) {
        return this.getCollectionsByOrg(organizationId);
      }

      this.isLoading = true;
      try {
        const { data, error } = await $supabase
          .from("collections")
          .select("*")
          .eq("organization_id", organizationId);

        if (error) throw error;

        if (data) {
          this.collections.push(...data); // Cache collections
        }
        return data;
      } catch (err) {
        this.error = `Failed to fetch collections for organization ${organizationId}.`;
        console.error(err);
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch a single collection by ID (ensuring it belongs to the user's org)
    async fetchCollectionById(id: number) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();

      const cachedCollection = this.getCollectionById(id);
      if (cachedCollection) {
        return cachedCollection;
      }

      this.isLoading = true;
      try {
        const { data, error } = await $supabase
          .from("collections")
          .select("*")
          .eq("id", id)
          .eq("organization_id", authStore.org_id) // Ensure it belongs to the user's org
          .single();

        if (error) throw error;

        if (data) {
          this.collections.push(data); // Cache the fetched collection
        }
        return data;
      } catch (err) {
        this.error = `Failed to fetch collection with ID ${id}.`;
        console.error(err);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // Clear cache
    clearCollections() {
      this.collections = [];
    },
  },
});
