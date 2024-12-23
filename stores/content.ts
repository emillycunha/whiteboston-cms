import { defineStore } from "pinia";
import { useAuthStore } from "~/stores/auth";

export const useContentStore = defineStore("content", {
  state: () => ({
    content: [] as Array<Record<string, any>>, // Content data
    fields: [] as Array<{ key: string; label: string }>, // Table fields
    error: null as string | null,
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
          .select("name, type")
          .eq("collection_id", collectionId);

        if (fieldsError) {
          console.error("[Content Store] Failed to fetch fields:", fieldsError);
          throw fieldsError;
        }

        console.log("[Content Store] Fetched fields:", fieldsData);

        // Map fields into table column format
        this.fields = fieldsData.map((field) => ({
          key: field.name, // Use field name as the key
          label: field.name.charAt(0).toUpperCase() + field.name.slice(1), // Capitalize for display
        }));

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

        console.log("[Content Store] Fetched content:", contentData);

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
      this.isLoading = true;

      try {
        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .single();

        if (collectionError) throw collectionError;

        const { data, error } = await $supabase
          .from("content")
          .select("id, data")
          .eq("id", itemId)
          .eq("collection_id", collectionData.id)
          .single();

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
      this.isLoading = true;

      try {
        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .single();

        if (collectionError) throw collectionError;

        const { error } = await $supabase
          .from("content")
          .update({ data: updatedData })
          .eq("id", itemId)
          .eq("collection_id", collectionData.id);

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

    resetContent() {
      console.log("[Content Store] Resetting content and fields.");
      this.content = [];
      this.fields = [];
      this.error = null;
      this.isLoading = false;
    },
  },
});
