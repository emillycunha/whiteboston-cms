import { defineStore } from "pinia";
import { useAuthStore } from "~/stores/auth";

interface Field {
  key: string;
  label: string;
  type: string;
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
}

export const useContentStore = defineStore("content", {
  state: (): ContentStoreState => ({
    content: [],
    fields: [],
    error: null,
    isLoading: false,
  }),

  actions: {
    async fetchContentAndFields(collectionSlug: string) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      this.isLoading = true;

      try {
        console.log(
          `[Content Store] Fetching fields and content for: ${collectionSlug}`
        );

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
          .select("name, type, options, position")
          .eq("collection_id", collectionId);

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
            key: field.name,
            label: field.name.charAt(0).toUpperCase() + field.name.slice(1),
            type: field.type,
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

        if (authStore.role === "editor") {
          query = query.eq("user_id", authStore.id); // Restrict to user's content for editors
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
        this.isLoading = false;
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

        if (authStore.role === "editor") {
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

    // Update a single item in the content table
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

        if (authStore.role === "editor") {
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
            collection_id: collectionData.id,
            name: field.key,
            type: field.type,
            position: field.position,
            options:
              field.type === "select" ? JSON.stringify(field.options) : null,
          }))
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
      this.content = [];
      this.fields = [];
      this.error = null;
      this.isLoading = false;
    },
  },
});
