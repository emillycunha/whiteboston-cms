import { defineStore } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { useNotificationStore } from "~/stores/notification";

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_hidden: boolean;
  organization_id: string;
  created_at: string;
  position: number;
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
      const organizationId = authStore.org_id;

      // Check if the user has the required permission
      if (!authStore.canView) {
        console.error(
          "[Collections Store] User does not have permission to view collections."
        );
        this.error = "You do not have permission to view collections.";
        return [];
      }

      // Check if organization ID is available
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
          .eq("organization_id", organizationId)
          .order("position", { ascending: true });

        if (error) throw error;

        if (data) {
          this.collections = [...data];
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
      const organizationId = authStore.org_id;

      // Check if the user has the required permission
      if (!authStore.canView) {
        console.error(
          "[Collections Store] User does not have permission to view collections."
        );
        this.error = "You do not have permission to view collections.";
        return [];
      } else {
        console.log(
          "[Collections Store] Permission granted: User can view collections."
        );
      }

      if (!organizationId) {
        console.error("[Collections Store] Missing organization ID.");
        this.error = "User is not associated with any organization.";
        return null;
      }

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
          .eq("organization_id", authStore.org_id)
          .single();

        if (error) throw error;

        if (data) {
          this.collections.push(data);
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

    // Fetch a collection by slug
    async fetchCollectionBySlug(slug: string) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const organizationId = authStore.org_id;

      // Check if the user has the required permission
      if (!authStore.canView) {
        console.error(
          "[Collections Store] User does not have permission to view collections."
        );
        this.error = "You do not have permission to view collections.";
        return [];
      } else {
        console.log(
          "[Collections Store] Permission granted: User can view collections."
        );
      }

      if (!organizationId) {
        console.error("[Collections Store] Missing organization ID.");
        this.error = "User is not associated with any organization.";
        return null;
      }

      try {
        const { data, error } = await $supabase
          .from("collections")
          .select("*")
          .eq("slug", slug)
          .eq("organization_id", organizationId)
          .single();

        console.log("[Fetch Collection By Slug] Query Response:", {
          data,
          error,
        });

        if (error) {
          console.error(
            "[Collections Store] Error fetching collection by slug:",
            error
          );
          this.error = "Failed to fetch collection.";
          return null;
        }

        return data;
      } catch (err) {
        console.error(
          "[Collections Store] Failed to fetch collection by slug:",
          err
        );
        this.error = "Failed to fetch collection.";
        return null;
      }
    },

    // Update a collection
    async updateCollection(updatedCollection: Collection) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      this.isLoading = true;

      // Check if the user has the required permission
      if (!authStore.canEdit) {
        console.error(
          "[Collections Store] User does not have permission to edit collections."
        );

        notificationStore.showNotification(
          "error",
          "You do not have permission to edit collections."
        );

        this.error = "You do not have permission to edit collections.";
        return false;
      } else {
        console.log(
          "[Collections Store] Permission granted: User can edit collections."
        );

        notificationStore.showNotification(
          "success",
          "Permission granted. You can edit collections."
        );
      }

      try {
        const { error } = await $supabase
          .from("collections")
          .update({
            name: updatedCollection.name,
            slug: updatedCollection.slug,
            description: updatedCollection.description,
            is_hidden: updatedCollection.is_hidden,
            position: updatedCollection.position,
          })
          .eq("id", updatedCollection.id);

        if (error) throw error;

        // Update the local state
        const index = this.collections.findIndex(
          (c) => c.id === updatedCollection.id
        );
        if (index !== -1) {
          this.collections[index] = updatedCollection;
        }

        return true;
      } catch (err) {
        console.error("[Collections Store] Failed to update collection:", err);
        this.error = "Failed to update collection.";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    // Add a new collection
    async addCollection(newCollection: {
      name: string;
      slug: string;
      description?: string;
      is_hidden: boolean;
      position: number;
    }) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const organizationId = authStore.org_id;
      const notificationStore = useNotificationStore();

      // Check if the user has the required permission
      if (!authStore.canAddCollections) {
        console.error(
          "[Collections Store] User does not have permission to add collections."
        );

        notificationStore.showNotification(
          "error",
          "You do not have permission to add collections."
        );

        this.error = "You do not have permission to add collections.";
        return false;
      } else {
        console.log(
          "[Collections Store] Permission granted: User can add collections."
        );

        notificationStore.showNotification(
          "success",
          "Permission granted. You can add collections."
        );
      }

      if (!organizationId) {
        this.error = "Organization ID is missing.";
        console.error("[Collections Store] Organization ID is missing.");
        return false;
      }

      try {
        const { data, error } = await $supabase.from("collections").insert({
          ...newCollection,
          organization_id: organizationId,
        });

        if (error) {
          console.error("[Collections Store] Failed to add collection:", error);
          this.error = error.message;
          return false;
        }

        if (data) {
          this.collections.push(data[0]);
          console.log(
            "[Collections Store] Collection added successfully:",
            data[0]
          );
        }
        return true;
      } catch (err) {
        console.error("[Collections Store] Unexpected error:", err);
        this.error = "An unexpected error occurred.";
        return false;
      }
    },

    // Check if a slug already exists
    async checkSlugExists(slug: string) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const organizationId = authStore.org_id;

      // Safeguard: Ensure organization ID exists
      if (!organizationId) {
        console.error("[Collections Store] Missing organization ID.");
        return false;
      }

      console.log("[Check Slug Exists] Inputs:", { slug, organizationId });

      try {
        const { data, error } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", slug)
          .eq("organization_id", organizationId)
          .maybeSingle();

        console.log("[Check Slug Exists] Query Response:", { data, error });

        if (error) {
          if (error.code === "PGRST116") {
            return false;
          } else {
            console.error(
              "[Collections Store] Unexpected error checking slug:",
              error
            );
            throw error;
          }
        }

        const exists = data !== null;
        console.log("[Check Slug Exists] Slug existence check result:", exists);

        return exists;
      } catch (err) {
        console.error("[Collections Store] Error checking slug:", err);
        return false;
      }
    },

    async updateCollectionPositions(updatedCollections: Collection[]) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      // Check if the user has the required permission
      if (!authStore.canEdit) {
        console.error(
          "[Collections Store] User does not have permission to edit collections."
        );

        notificationStore.showNotification(
          "error",
          "You do not have permission to edit collections."
        );

        this.error = "You do not have permission to edit collections.";
        return false;
      } else {
        console.log(
          "[Collections Store] Permission granted: User can edit collections."
        );

        notificationStore.showNotification(
          "success",
          "Permission granted. You can edit collections."
        );
      }

      try {
        const updates = updatedCollections.map((collection) => ({
          id: collection.id,
          position: collection.position,
          name: collection.name,
          slug: collection.slug,
          organization_id: collection.organization_id,
        }));

        console.log("[Update Positions] Payload:", updates);

        const { data, error } = await $supabase
          .from("collections")
          .upsert(updates, { onConflict: "id" });

        if (error) throw error;

        console.log("[Update Positions] Collections updated:", data);
        return data;
      } catch (err) {
        console.error("[Update Positions] Failed to update positions:", err);
        throw err;
      }
    },

    // Clear cache
    clearCollections() {
      this.collections = [];
    },
  },
});
