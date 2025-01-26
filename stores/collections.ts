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
      const notificationStore = useNotificationStore();

      const rolePermissions = permissions[authStore.role || "none"];
      const hasPermission = rolePermissions?.[permission];

      if (!hasPermission) {
        const message = `You do not have permission to ${permission
          .replace(/^can/, "")
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()
          .trim()}.`;

        notificationStore.showNotification(NotificationType.Error, message);

        return false;
      }

      return true;
    },

    async fetchCollectionsForCurrentOrg() {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();
      const organizationId = authStore.org_id;

      if (!(await this.checkPermissions("canView"))) return [];

      if (!organizationId) {
        notificationStore.showNotification(
          NotificationType.Error,
          "Organization ID is missing."
        );
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

        if (error) {
          notificationStore.showNotification(
            NotificationType.Error,
            `Failed to fetch collections for organization ${organizationId}. Please try again later.`
          );
          return [];
        }

        if (data) {
          this.collections = [...data];
        }
        return data;
      } catch (err) {
        console.error(err);
        notificationStore.showNotification(
          NotificationType.Error,
          `An unexpected error occurred while fetching collections.`
        );
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCollectionById(id: number) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();
      const organizationId = authStore.org_id;

      if (!(await this.checkPermissions("canView"))) return null;

      if (!organizationId) {
        notificationStore.showNotification(
          NotificationType.Error,
          "User is not associated with any organization."
        );
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

        if (error) {
          notificationStore.showNotification(
            NotificationType.Error,
            `Failed to fetch collection with ID ${id}. Please try again later.`
          );
          return null;
        }

        if (data) {
          this.collections.push(data);
        }
        return data;
      } catch (err) {
        console.error(err);
        notificationStore.showNotification(
          NotificationType.Error,
          `An unexpected error occurred while fetching the collection.`
        );
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
      const notificationStore = useNotificationStore();

      this.isLoading = true;

      if (!(await this.checkPermissions("canEdit"))) {
        notificationStore.showNotification(
          NotificationType.Error,
          "You do not have permission to edit collections."
        );
        return false;
      }

      try {
        const { error } = await $supabase
          .from("collections")
          .update({
            updatedCollection,
          })
          .eq("id", updatedCollection.id);

        if (error) {
          notificationStore.showNotification(
            NotificationType.Error,
            "Failed to update the collection. Please try again later."
          );
          return false;
        }

        const index = this.collections.findIndex(
          (c) => c.id === updatedCollection.id
        );
        if (index !== -1) {
          this.collections[index] = updatedCollection;
        }

        notificationStore.showNotification(
          NotificationType.Success,
          "Collection updated successfully."
        );

        return true;
      } catch (err) {
        console.error(err);
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while updating the collection."
        );
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
      const notificationStore = useNotificationStore();
      const organizationId = authStore.org_id;

      if (!(await this.checkPermissions("canAddCollections"))) {
        notificationStore.showNotification(
          NotificationType.Error,
          "You do not have permission to add collections."
        );
        return false;
      }

      if (!organizationId) {
        notificationStore.showNotification(
          NotificationType.Error,
          "Organization ID is missing."
        );
        console.error("[Collections Store] Organization ID is missing.");
        return false;
      }

      try {
        const { data, error } = await $supabase.from("collections").insert({
          ...newCollection,
          organization_id: organizationId,
        });

        if (error) {
          notificationStore.showNotification(
            NotificationType.Error,
            "Failed to add the collection. Please try again later."
          );
          return false;
        }

        if (data) {
          this.collections.push(data[0]);
          notificationStore.showNotification(
            NotificationType.Success,
            "Collection added successfully."
          );
        }
        return true;
      } catch (err) {
        console.error(err);
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while adding the collection."
        );
        return false;
      }
    },

    async checkSlugExists(slug: string) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();
      const organizationId = authStore.org_id;

      if (!organizationId) {
        notificationStore.showNotification(
          NotificationType.Error,
          "Organization ID is missing."
        );
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
            notificationStore.showNotification(
              NotificationType.Error,
              "Failed to check slug existence. Please try again later."
            );
            return false;
          }
        }

        return data !== null;
      } catch (err) {
        console.error(err);
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while checking slug existence."
        );
        return false;
      }
    },

    async updateCollectionPositions(updatedCollections: Collection[]) {
      const { $supabase } = useNuxtApp();
      const notificationStore = useNotificationStore();

      if (!(await this.checkPermissions("canEdit"))) {
        notificationStore.showNotification(
          NotificationType.Error,
          "You do not have permission to edit collections."
        );
        return false;
      }

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

        if (error) {
          notificationStore.showNotification(
            NotificationType.Error,
            "Failed to update collection positions. Please try again later."
          );
          return false;
        }

        notificationStore.showNotification(
          NotificationType.Success,
          "Collection positions updated successfully."
        );

        return data;
      } catch (err) {
        console.error(err);
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while updating collection positions."
        );
        return false;
      }
    },

    clearCollectionCache() {
      this.collections = [];
    },
  },
});
