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
  error: string | null;
  isLoading: boolean;
  isLoadingBySlug: Record<string, boolean>;
}

export const useContentStore = defineStore("content", {
  state: (): ContentStoreState => ({
    content: {}, // Initialize as an object
    fields: {}, // Initialize as an object
    error: null,
    isLoading: false,
    isLoadingBySlug: {},
  }),

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

    async fetchCollectionBySlug(slug: string) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();

      console.log("[Content Store] Checking collection for slug:", slug);

      const { data: collectionData, error: collectionError } = await $supabase
        .from("collections")
        .select("id")
        .eq("slug", slug)
        .eq("organization_id", authStore.org_id)
        .maybeSingle();

      if (collectionError) {
        // Handle specific error codes (e.g., PGRST116 for missing rows or other cases)
        if (collectionError.code === "PGRST116") {
          console.warn(
            "[Content Store] No collection found for slug:",
            slug,
            "Error details:",
            collectionError.message
          );
          return null; // Return null or handle as needed
        }

        console.error(
          "[Content Store] Error fetching collection:",
          collectionError
        );
        throw new Error("Failed to fetch collection.");
      }

      if (!collectionData) {
        console.warn("[Content Store] No collection found for slug:", slug);
        return null; // Return null if no data is found
      }

      return collectionData;
    },

    async fetchContentAndFields(collectionSlug: string) {
      if (!this.checkPermissions("canView")) return;

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
          throw new Error(`Collection "${collectionSlug}" not found.`);
        }

        const collectionId = collectionData.id;

        // Fetch fields and content for this collection
        const [fields, content] = await Promise.all([
          this.fetchFields(collectionSlug, collectionId),
          this.fetchContent(collectionSlug, collectionId),
        ]);

        console.log("[Content Store] Fields fetched:", fields);
        console.log("[Content Store] Content fetched:", content);

        // Store results in slug-specific keys
        this.fields[collectionSlug] = fields;
        this.content[collectionSlug] = content;
      } catch (error) {
        console.error(
          `[Content Store] Error fetching content for ${collectionSlug}:`,
          error
        );
        throw error;
      } finally {
        this.isLoadingBySlug[collectionSlug] = false;
        this.isLoading = false;
      }
    },

    async fetchFields(
      collectionSlug: string,
      collectionId: number
    ): Promise<Field[]> {
      const { $supabase } = useNuxtApp();

      if (!(await this.checkPermissions("canView"))) return [];

      try {
        const { data: fieldsData, error: fieldsError } = await $supabase
          .from("fields")
          .select("id, name, type, options, position, is_required")
          .eq("collection_id", collectionId);

        if (fieldsError) throw fieldsError;

        // Process and return fields
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
        this.error = "Failed to fetch fields.";
        return [];
      }
    },

    async fetchContent(
      collectionSlug: string,
      collectionId: number
    ): Promise<ContentItem[]> {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();

      if (!(await this.checkPermissions("canView"))) return [];

      try {
        const query = $supabase
          .from("content")
          .select("id, data, created_at, updated_at")
          .eq("collection_id", collectionId)
          .eq("organization_id", authStore.org_id);

        if (authStore.role === "viewer") {
          query.eq("user_id", authStore.id);
        }

        const { data: contentData, error: contentError } = await query;

        if (contentError) throw contentError;

        // Process and return the content data
        const processedContent = (contentData || []).map((item) => ({
          id: item.id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          data: item.data,
        }));

        // Store the content data using the collectionSlug key
        this.content[collectionSlug] = processedContent;

        console.log(
          `[Content Store] Content fetched for collection "${collectionSlug}":`,
          this.content[collectionSlug]
        );

        return processedContent; // Return the processed content
      } catch (err) {
        console.error("[Content Store] Error fetching content:", err);
        this.error = "Failed to fetch content.";
        return []; // Return an empty array on error
      }
    },

    async updateContentItem(
      collectionSlug: string,
      itemId: number,
      updatedData: Record<string, any>
    ) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      if (!(await this.checkPermissions("canAddContent"))) return false;

      const collectionData = await this.fetchCollectionBySlug(collectionSlug);

      if (!collectionData) {
        console.error("[Content Store] Collection not found.");
        this.error = "Collection not found.";
        return false;
      }

      const collectionId = collectionData.id;

      try {
        const { error } = await $supabase
          .from("content")
          .update({ data: updatedData })
          .eq("id", itemId)
          .eq("collection_id", collectionId);

        if (error) throw error;

        return true;
      } catch (err) {
        console.error("[Content Store] Failed to update item:", err);
        this.error = "Failed to update item.";
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

      if (!(await this.checkPermissions("canAddContent"))) return false;

      const collectionData = await this.fetchCollectionBySlug(collectionSlug);

      if (!collectionData) {
        console.error("[Content Store] Collection not found.");
        this.error = "Collection not found.";
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

        if (error) throw error;

        return true;
      } catch (err) {
        console.error("[Content Store] Failed to add new item:", err);
        this.error = "Failed to add new item.";
        return false;
      }
    },

    async fetchContentCount(collectionId: number) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();

      if (!(await this.checkPermissions("canView"))) return 0;

      try {
        const { count, error } = await $supabase
          .from("content")
          .select("id", { count: "exact" })
          .eq("collection_id", collectionId);

        if (error) {
          console.error(
            "[Content Store] Failed to fetch content count:",
            error
          );
          return 0;
        }

        return count || 0;
      } catch (err) {
        console.error("[Content Store] Error fetching content count:", err);
        return 0;
      }
    },

    clearContent() {
      this.content = {};
    },
  },
});
