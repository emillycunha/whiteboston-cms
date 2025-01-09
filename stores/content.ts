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
      if (this.isLoadingBySlug[collectionSlug]) {
        console.log("[Content Store] Fetch already in progress. Skipping...");
        return;
      }

      this.isLoadingBySlug[collectionSlug] = true;

      try {
        // Step 1: Fetch the collection ID using the slug
        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .eq("organization_id", authStore.org_id)
          .single();

        if (collectionError) {
          console.error(
            "[Content Store] Failed to fetch collection ID:",
            collectionError
          );
          throw collectionError;
        }

        const collectionId = collectionData?.id;
        if (!collectionId) {
          throw new Error("Collection ID not found for the provided slug.");
        }

        console.log(`[Content Store] Fetched collection ID: ${collectionId}`);

        // Step 2: Fetch the fields of the collection
        const { data: fieldsData, error: fieldsError } = await $supabase
          .from("fields")
          .select("id, name, type, options, position, is_required")
          .eq("collection_id", collectionId);

        // Sort the fieldsData by position before mapping
        if (fieldsData) {
          fieldsData.sort((a, b) => (a.position || 99) - (b.position || 99));
        }

        if (fieldsError) {
          console.error("[Content Store] Failed to fetch fields:", fieldsError);
          throw fieldsError;
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
              // Use the array directly if it's already parsed
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
          throw contentError;
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
            : "Failed to fetch content and fields.";
      } finally {
        this.isLoadingBySlug[collectionSlug] = false;
      }
    },

    async fetchContentItem(collectionSlug: string, itemId: number) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      this.isLoading = true;

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
      this.isLoading = true;

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
      this.isLoading = true;

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
      this.isLoading = true;

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
              field.type === "select" ? JSON.stringify(field.options) : null,
          })),

          { onConflict: "id" }
        );

        if (error) throw error;

        return true;
      } catch (err) {
        console.error("Failed to update collection fields:", err);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    resetContent() {
      console.log("[Content Store] Resetting content and fields.");
      this.$reset();
    },
  },
});
