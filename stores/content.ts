import { defineStore } from "pinia";
import { useAuthStore } from "~/stores/auth";

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
  content: ContentItem[];
  fields: Field[];
  error: string | null;
  isLoading: boolean;
  isLoadingBySlug: Record<string, boolean>;
}

export const useContentStore = defineStore("content", {
  state: (): ContentStoreState => ({
    content: [],
    fields: [],
    error: null,
    isLoading: false,
    isLoadingBySlug: {},
  }),

  actions: {
    async fetchContentAndFields(collectionSlug: string) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();

      // Check if the user has the required permission
      if (!authStore.canView) {
        console.error(
          "[Content Store] User does not have permission to view content."
        );
        this.error = "You do not have permission to view content.";
        return [];
      }

      // Prevent concurrent loading for the same slug
      if (this.isLoadingBySlug[collectionSlug]) {
        console.log("[Content Store] Fetch already in progress. Skipping...");
        return;
      }

      this.isLoading = true;
      this.isLoadingBySlug[collectionSlug] = true;

      try {
        // Step 1: Fetch the collection ID using the slug
        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .eq("organization_id", authStore.org_id)
          .maybeSingle();

        if (collectionError) {
          console.error(
            "[Content Store] Error fetching collection ID:",
            collectionError
          );
          throw new Error("Failed to fetch collection. Please try again.");
        }

        // Handle case where no collection is found
        if (!collectionData) {
          console.warn(
            `[Content Store] No collection found for the provided slug: ${collectionSlug}. Treating as empty.`
          );
          this.fields = []; // Treat it as having no fields
          this.content = []; // Treat it as having no content
          return; // Exit early without fetching further
        }

        const collectionId = collectionData.id;

        // Step 2: Fetch the fields of the collection
        const { data: fieldsData, error: fieldsError } = await $supabase
          .from("fields")
          .select("id, name, type, options, position, is_required")
          .eq("collection_id", collectionId);

        if (fieldsError) {
          console.error("[Content Store] Failed to fetch fields:", fieldsError);
          throw new Error("Failed to fetch fields for the collection.");
        }

        // Sort the fieldsData by position
        if (fieldsData) {
          fieldsData.sort((a, b) => (a.position || 99) - (b.position || 99));
        }

        // Map fields into table column format
        this.fields = fieldsData.map((field: any): Field => {
          let parsedOptions = null;

          if (field.options) {
            if (typeof field.options === "string") {
              try {
                // Parse only if it's a JSON string
                parsedOptions = JSON.parse(field.options);
              } catch (err) {
                console.error(
                  `[Content Store] Failed to parse options for field: ${field.name}`,
                  field.options,
                  err
                );
              }
            } else if (Array.isArray(field.options)) {
              parsedOptions = field.options;
            }
          }

          return {
            id: field.id,
            key: field.name,
            label: field.name.charAt(0).toUpperCase() + field.name.slice(1),
            name: field.name,
            type: field.type,
            is_required: field.is_required,
            options: parsedOptions,
            position: field.position,
          };
        });

        // Step 3: Fetch the content of the collection
        let query = $supabase
          .from("content")
          .select("id, data, created_at, updated_at")
          .eq("collection_id", collectionId)
          .eq("organization_id", authStore.org_id);

        if (authStore.role === "viewer") {
          query = query.eq("user_id", authStore.id);
        }

        const { data: contentData, error: contentError } = await query;

        if (contentError) {
          console.error(
            "[Content Store] Failed to fetch content:",
            contentError
          );
          throw new Error("Failed to fetch content for the collection.");
        }

        // Map the content's `data` field to include dynamic fields
        this.content = contentData.map((item) => ({
          id: item.id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          ...item.data, // Spread dynamic fields from `data`
        }));
      } catch (err) {
        console.error("[Content Store] Error:", err);
        this.error =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while fetching content and fields.";
      } finally {
        this.isLoading = false;
        this.isLoadingBySlug[collectionSlug] = false;
      }
    },

    async fetchContentItem(collectionSlug: string, itemId: number) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      this.isLoading = true;

      // Check if the user has the required permission
      if (!authStore.canView) {
        console.error(
          "[Content Store] User does not have permission to view content."
        );
        this.error = "You do not have permission to view content.";
        return [];
      } else {
        console.log(
          "[Content Store] Permission granted: User can view content."
        );
      }

      try {
        // Step 1: Validate the collection and organization
        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .eq("organization_id", authStore.org_id)
          .single();

        if (collectionError) throw collectionError;

        // Step 2: Fetch the specific content item
        let query = $supabase
          .from("content")
          .select("id, data")
          .eq("id", itemId)
          .eq("collection_id", collectionData.id);

        if (authStore.role === "viewer") {
          query = query.eq("user_id", authStore.id);
        }

        const { data, error } = await query.single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error("[Content Store] Failed to fetch item:", err);
        this.error = "Failed to fetch item.";
        return null;
      } finally {
        this.isLoading = false;
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

      this.isLoading = true;

      // Check if the user has the required permission
      if (!authStore.canAddContent) {
        console.error(
          "[Content Store] User does not have permission to edit content."
        );

        notificationStore.showNotification(
          "error",
          "You do not have permission to edit content."
        );

        this.error = "You do not have permission to edit content.";
        return false;
      } else {
        console.log(
          "[Content Store] Permission granted: User can edit content."
        );

        /* Show success notification
        notificationStore.showNotification(
          "success",
          "Permission granted. You can edit content."
        ); */
      }

      try {
        // Step 1: Validate the collection and organization
        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .eq("organization_id", authStore.org_id)
          .single();

        if (collectionError) throw collectionError;

        // Step 2: Update the content item
        let query = $supabase
          .from("content")
          .update({ data: updatedData })
          .eq("id", itemId)
          .eq("collection_id", collectionData.id);

        if (authStore.role === "viewer") {
          query = query.eq("user_id", authStore.id);
        }

        const { error } = await query;

        if (error) throw error;

        return true;
      } catch (err) {
        console.error("[Content Store] Failed to update item:", err);
        this.error = "Failed to update item.";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async addContentItem(
      collectionSlug: string,
      newItemData: Record<string, any>
    ) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      this.isLoading = true;

      // Check if the user has the required permission
      if (!authStore.canAddContent) {
        console.error(
          "[Content Store] User does not have permission to add content."
        );

        notificationStore.showNotification(
          "error",
          "You do not have permission to add content."
        );

        this.error = "You do not have permission to add content.";
        return false;
      } else {
        console.log(
          "[Content Store] Permission granted: User can add content."
        );

        /* Show success notification
        notificationStore.showNotification(
          "success",
          "Permission granted. You can add content."
        ); */
      }

      try {
        // Step 1: Validate the collection and organization
        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .eq("organization_id", authStore.org_id)
          .single();

        if (collectionError) throw collectionError;

        // Step 2: Insert the new item
        const { error } = await $supabase.from("content").insert({
          collection_id: collectionData.id,
          organization_id: authStore.org_id,
          user_id: authStore.id, // Assign the current user
          data: newItemData, // Store the dynamic fields
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (error) throw error;

        return true;
      } catch (err) {
        console.error("[Content Store] Failed to add new item:", err);
        this.error = "Failed to add new item.";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async updateCollectionFields(
      collectionSlug: string,
      updatedFields: Field[]
    ) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      this.isLoading = true;

      // Check if the user has the required permission
      if (!authStore.canEdit) {
        console.error(
          "[Collections Store] User does not have permission to edit collections."
        );

        // Show error notification
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

        /* Show success notification
        notificationStore.showNotification(
          "success",
          "Permission granted. You can edit collections."
        ); */
      }

      try {
        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .single();

        if (collectionError) throw collectionError;

        const { error } = await $supabase.from("fields").upsert(
          updatedFields.map((field) => ({
            id: field.id,
            collection_id: collectionData.id,
            name: field.name,
            type: field.type,
            position: field.position,
            is_required: field.is_required,
            options:
              field.type === "select" && Array.isArray(field.options)
                ? JSON.stringify(field.options)
                : null,
          })),

          { onConflict: "id" }
        );

        if (error) throw new Error(`Failed to update fields: ${error.message}`);

        return true;
      } catch (err) {
        console.error("Failed to update collection fields:", err);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async addNewCollectionFields(collectionSlug: string, newFields: Field[]) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      // Check if the user has the required permission
      if (!authStore.canAddFields) {
        console.error(
          "[Content Store] User does not have permission to add fields."
        );

        notificationStore.showNotification(
          "error",
          "You do not have permission to add fields."
        );

        this.error = "You do not have permission to add fields.";
        return false;
      } else {
        console.log("[Content Store] Permission granted: User can add fields.");

        /* Show success notification
        notificationStore.showNotification(
          "success",
          "Permission granted. You can add fields."
        ); */
      }

      try {
        // Fetch collection ID
        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .eq("organization_id", authStore.org_id)
          .single();

        if (collectionError)
          throw new Error(`Collection not found: ${collectionError.message}`);

        // Insert new fields
        const { error: insertError } = await $supabase.from("fields").insert(
          newFields.map((field) => ({
            ...field,
            collection_id: collectionData.id, // Attach the collection ID
          }))
        );

        if (insertError)
          throw new Error(`Failed to add new fields: ${insertError.message}`);

        return true;
      } catch (err) {
        console.error("Failed to add new fields:", err);
        throw err;
      }
    },

    // Fetch content count for a collection
    async fetchContentCount(collectionId: number) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();

      // Check if the user has the required permission
      if (!authStore.canView) {
        console.error(
          "[Collections Store] User does not have permission to view collections."
        );
        this.error = "You do not have permission to view collections.";
        return [];
      }

      try {
        const { count, error } = await $supabase
          .from("content")
          .select("id", { count: "exact" })
          .eq("collection_id", collectionId);

        if (error) {
          console.error(
            "[Collections Store] Failed to fetch content count:",
            error
          );
          return 0;
        }

        return count || 0;
      } catch (err) {
        console.error("[Collections Store] Error fetching content count:", err);
        return 0;
      }
    },

    resetContent() {
      console.log("[Content Store] Resetting content and fields.");
      this.$reset();
    },
  },
});
