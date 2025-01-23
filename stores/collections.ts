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
    async checkPermissions(
      permission: keyof (typeof permissions)["SuperAdmin"]
    ) {
      const authStore = useAuthStore();
      const rolePermissions = permissions[authStore.role || "none"];
      const hasPermission = rolePermissions?.[permission];

      if (!hasPermission) {
        const message = `You do not have permission to ${permission
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()}.`;

        const notificationStore = useNotificationStore();
        notificationStore.showNotification(NotificationType.Error, message);
        this.error = message;

        return false;
      }

      return true;
    },

    async fetchCollectionsForCurrentOrg() {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const organizationId = authStore.org_id;

      if (!(await this.checkPermissions("canView"))) return [];

      if (!organizationId) {
        this.error = "Organization ID is missing.";
        return [];
      }

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

    async fetchCollectionById(id: number) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const organizationId = authStore.org_id;

      if (!(await this.checkPermissions("canView"))) return null;

      if (!organizationId) {
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
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCollectionBySlug(slug: string) {
      const contentStore = useContentStore();
      return contentStore.fetchCollectionBySlug(slug);
    },

    async updateCollection(updatedCollection: Collection) {
      const { $supabase } = useNuxtApp();

      this.isLoading = true;

      if (!(await this.checkPermissions("canEdit"))) return false;

      try {
        const { error } = await $supabase
          .from("collections")
          .update({
            updatedCollection,
          })
          .eq("id", updatedCollection.id);

        if (error) throw error;

        const index = this.collections.findIndex(
          (c) => c.id === updatedCollection.id
        );
        if (index !== -1) {
          this.collections[index] = updatedCollection;
        }

        return true;
      } catch (err) {
        this.error = "Failed to update collection.";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

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

      if (!(await this.checkPermissions("canAddCollections"))) return false;

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
          this.error = error.message;
          return false;
        }

        if (data) {
          this.collections.push(data[0]);
        }
        return true;
      } catch (err) {
        this.error = "An unexpected error occurred.";
        return false;
      }
    },

    async checkSlugExists(slug: string) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const organizationId = authStore.org_id;

      // Safeguard: Ensure organization ID exists
      if (!organizationId) {
        return false;
      }

      try {
        const { data, error } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", slug)
          .eq("organization_id", organizationId)
          .maybeSingle();

        if (error) {
          if (error.code === "PGRST116") {
            return false;
          } else {
            console.error(error);
            throw error;
          }
        }

        return data !== null;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    async updateCollectionPositions(updatedCollections: Collection[]) {
      const { $supabase } = useNuxtApp();

      if (!(await this.checkPermissions("canEdit"))) return false;

      try {
        const updates = updatedCollections.map((collection) => ({
          id: collection.id,
          position: collection.position,
          name: collection.name,
          slug: collection.slug,
          organization_id: collection.organization_id,
        }));

        const { data, error } = await $supabase
          .from("collections")
          .upsert(updates, { onConflict: "id" });

        if (error) throw error;

        return data;
      } catch (err) {
        throw err;
      }
    },

    // Clear cache
    clearCollections() {
      this.collections = [];
    },
  },
});
