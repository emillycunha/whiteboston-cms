import { defineStore } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { useNotificationStore } from "~/stores/notification";

interface Field {
  key: string;
  label: string;
  id: number;
  name: string;
  type: string;
  is_required: boolean;
  options?: Array<{ value: string; label: string }>;
  position?: number;
}

interface ContentItem {
  id: number;
  created_at: string;
  updated_at: string;
  data: Record<string, any>;
}

interface ContentStoreState {
  content: Record<string, ContentItem[]>;
  fields: Record<string, Field[]>;
  isLoading: boolean;
  isLoadingBySlug: Record<string, boolean>;
}

export const useContentStore = defineStore("content", {
  state: (): ContentStoreState => ({
    content: {},
    fields: {},
    isLoading: false,
    isLoadingBySlug: {},
  }),

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

    async fetchCollectionBySlug(slug: string) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      this.isLoading = true;

      try {
        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", slug)
          .eq("organization_id", authStore.org_id)
          .maybeSingle();

        if (collectionError) {
          if (collectionError.code === "PGRST116") {
            console.warn(
              "[Content Store] No collection found for slug:",
              slug,
              "Error details:",
              collectionError.message
            );
            notificationStore.showNotification(
              NotificationType.Info,
              "No collection found for the specified slug."
            );
            return null;
          }

          console.error(
            "[Content Store] Error fetching collection:",
            collectionError
          );
          notificationStore.showNotification(
            NotificationType.Error,
            "Failed to fetch collection. Please try again."
          );
          return null;
        }

        if (!collectionData) {
          console.warn("[Content Store] No collection found for slug:", slug);
          notificationStore.showNotification(
            NotificationType.Info,
            "No collection found for the specified slug."
          );
          return null;
        }

        return collectionData;
      } catch (err) {
        console.error("[Content Store] Unexpected error:", err);
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while fetching the collection."
        );
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchContentAndFields(collectionSlug: string) {
      const notificationStore = useNotificationStore();

      if (!this.checkPermissions("canView")) {
        notificationStore.showNotification(
          NotificationType.Error,
          "You do not have permission to view this content."
        );
        return;
      }

      if (this.isLoadingBySlug[collectionSlug]) {
        console.log("[Content Store] Fetch already in progress. Skipping...");
        return;
      }

      if (
        this.content[collectionSlug]?.length > 0 &&
        this.fields[collectionSlug]?.length > 0
      ) {
        console.log("[Content Store] Returning cached data...");
        return;
      }

      this.isLoading = true;
      this.isLoadingBySlug[collectionSlug] = true;

      try {
        const collectionData = await this.fetchCollectionBySlug(collectionSlug);

        if (!collectionData) {
          console.warn(
            `[Content Store] Collection not found for slug: ${collectionSlug}`
          );
          notificationStore.showNotification(
            NotificationType.Info,
            `Collection "${collectionSlug}" not found.`
          );
          return;
        }

        const collectionId = collectionData.id;

        // Fetch fields and content for this collection with proper signatures
        const fieldsPromise = this.fetchFields(collectionId); // Adjusted signature
        const contentPromise = this.fetchContent(collectionId); // Adjusted signature

        const [fields, content] = await Promise.all([
          fieldsPromise,
          contentPromise,
        ]);

        // Store results in slug-specific keys
        this.fields[collectionSlug] = fields;
        this.content[collectionSlug] = content;
      } catch (error) {
        console.error(
          `[Content Store] Error fetching content for ${collectionSlug}:`,
          error
        );
        notificationStore.showNotification(
          NotificationType.Error,
          `Failed to fetch content for "${collectionSlug}". Please try again later.`
        );
      } finally {
        this.isLoadingBySlug[collectionSlug] = false;
        this.isLoading = false;
      }
    },

    async fetchFields(collectionId: number): Promise<Field[]> {
      const { $supabase } = useNuxtApp();
      const notificationStore = useNotificationStore();

      if (!(await this.checkPermissions("canView"))) {
        notificationStore.showNotification(
          NotificationType.Error,
          "You do not have permission to view fields."
        );
        return [];
      }

      try {
        const { data: fieldsData, error: fieldsError } = await $supabase
          .from("fields")
          .select("id, name, type, options, position, is_required")
          .eq("collection_id", collectionId);

        if (fieldsError) {
          notificationStore.showNotification(
            NotificationType.Error,
            "Failed to fetch fields. Please try again later."
          );
          return [];
        }

        return (fieldsData || [])
          .sort((a, b) => (a.position || 99) - (b.position || 99))
          .map((field) => ({
            id: field.id,
            key: field.name,
            label: field.name.charAt(0).toUpperCase() + field.name.slice(1),
            name: field.name,
            type: field.type,
            is_required: field.is_required,
            options: field.options
              ? typeof field.options === "string"
                ? JSON.parse(field.options)
                : field.options
              : [],
            position: field.position,
          }));
      } catch (err) {
        console.error("[Content Store] Error fetching fields:", err);
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while fetching fields."
        );
        return [];
      }
    },

    async fetchContent(collectionId: number): Promise<ContentItem[]> {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      if (!(await this.checkPermissions("canView"))) {
        notificationStore.showNotification(
          NotificationType.Error,
          "You do not have permission to view content."
        );
        return [];
      }

      try {
        const query = $supabase
          .from("content")
          .select("id, data, created_at, updated_at")
          .eq("collection_id", collectionId)
          .eq("organization_id", authStore.org_id);

        const { data: contentData, error: contentError } = await query;

        if (contentError) {
          notificationStore.showNotification(
            NotificationType.Error,
            "Failed to fetch content. Please try again later."
          );
          return [];
        }

        const processedContent = (contentData || []).map((item) => ({
          id: item.id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          data: item.data,
        }));

        this.content[collectionId] = processedContent;

        return processedContent;
      } catch (err) {
        console.error("[Content Store] Error fetching content:", err);
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while fetching content."
        );
        return [];
      }
    },

    async updateContentItem(
      collectionSlug: string,
      itemId: number,
      updatedData: Record<string, any>
    ) {
      const { $supabase } = useNuxtApp();
      const notificationStore = useNotificationStore();

      if (!(await this.checkPermissions("canAddContent"))) {
        notificationStore.showNotification(
          NotificationType.Error,
          "You do not have permission to update content."
        );
        return false;
      }

      const collectionData = await this.fetchCollectionBySlug(collectionSlug);

      if (!collectionData) {
        notificationStore.showNotification(
          NotificationType.Error,
          "Collection not found."
        );
        return false;
      }

      const collectionId = collectionData.id;

      try {
        const { error } = await $supabase
          .from("content")
          .update({ data: updatedData })
          .eq("id", itemId)
          .eq("collection_id", collectionId);

        if (error) {
          notificationStore.showNotification(
            NotificationType.Error,
            "Failed to update content. Please try again later."
          );
          return false;
        }

        notificationStore.showNotification(
          NotificationType.Success,
          "Content item updated successfully."
        );
        return true;
      } catch (err) {
        console.error("[Content Store] Failed to update item:", err);
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while updating the content."
        );
        return false;
      }
    },

    async addContentItem(
      collectionSlug: string,
      newItemData: Record<string, any>
    ) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      if (!(await this.checkPermissions("canAddContent"))) {
        notificationStore.showNotification(
          NotificationType.Error,
          "You do not have permission to add content."
        );
        return false;
      }

      const collectionData = await this.fetchCollectionBySlug(collectionSlug);

      if (!collectionData) {
        notificationStore.showNotification(
          NotificationType.Error,
          "Collection not found."
        );
        return false;
      }

      const collectionId = collectionData.id;

      try {
        const { error } = await $supabase.from("content").insert({
          collection_id: collectionId,
          organization_id: authStore.org_id,
          user_id: authStore.id,
          data: newItemData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (error) {
          notificationStore.showNotification(
            NotificationType.Error,
            "Failed to add new content. Please try again later."
          );
          return false;
        }

        notificationStore.showNotification(
          NotificationType.Success,
          "Content item added successfully."
        );
        return true;
      } catch (err) {
        console.error("[Content Store] Failed to add new item:", err);
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while adding the content."
        );
        return false;
      }
    },

    async fetchContentCount(collectionId: number) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      if (!(await this.checkPermissions("canView"))) {
        notificationStore.showNotification(
          NotificationType.Error,
          "You do not have permission to view content count."
        );
        return 0;
      }

      try {
        const { count, error } = await $supabase
          .from("content")
          .select("id", { count: "exact" })
          .eq("collection_id", collectionId);

        if (error) {
          notificationStore.showNotification(
            NotificationType.Error,
            "Failed to fetch content count. Please try again later."
          );
          return 0;
        }

        return count || 0;
      } catch (err) {
        console.error("[Content Store] Error fetching content count:", err);
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while fetching content count."
        );
        return 0;
      }
    },

    clearContent() {
      this.content = {};
    },
  },
});
