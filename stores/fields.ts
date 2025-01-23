import { defineStore } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { useNotificationStore } from "~/stores/notification";

interface Option {
  value: string;
  label: string;
}

interface Field {
  key: string;
  label: string;
  id: number;
  name: string;
  type: string;
  is_required: boolean;
  options?: Option[];
  position?: number;
  collection_id?: number;
}

interface FieldStoreState {
  fields: Field[];
  error: string | null;
  isLoading: boolean;
  isLoadingBySlug: Record<string, boolean>;
}

export const useFieldStore = defineStore("field", {
  state: (): FieldStoreState => ({
    fields: [],
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

    async fetchCollectionFields(collectionSlug: string) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();

      this.isLoading = true;
      console.log("[Field Store] Starting to fetch collection fields...");

      if (!(await this.checkPermissions("canView"))) {
        console.log("[Field Store] Permission check failed.");
        return false;
      }

      try {
        console.log(
          `[Field Store] Fetching collection with slug: ${collectionSlug}`
        );

        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .eq("organization_id", authStore.org_id)
          .single();

        if (collectionError) {
          console.error(
            "[Field Store] Error fetching collection:",
            collectionError
          );
          throw new Error(`Collection not found: ${collectionError.message}`);
        }

        // Save collection ID to be used later
        const collectionId = collectionData.id;

        const { data: fieldsData, error: fieldsError } = await $supabase
          .from("fields")
          .select("*")
          .eq("collection_id", collectionId);

        if (fieldsError) {
          console.error("[Field Store] Error fetching fields:", fieldsError);
          throw new Error(`Failed to fetch fields: ${fieldsError.message}`);
        }

        this.fields = fieldsData.map((field) => ({
          id: field.id || 0,
          name: field.label || field.name || "Unnamed Field",
          key: field.key || `field_${Math.random().toString(36).substr(2, 5)}`,
          label: field.label || "Unnamed Field",
          type: field.type || "text",
          value: field.value || "",
          is_required: field.is_required || false,
          options: field.options || [],
          position: field.position || 0,
          collection_id: field.collection_id || null,
        }));
      } catch (err) {
        console.error("[Field Store] Error:", err);
        if (err instanceof Error) {
          this.error =
            err.message || "An error occurred while fetching fields.";
        } else {
          this.error = "An unknown error occurred.";
        }
      } finally {
        this.isLoading = false;
        console.log("[Field Store] Finished fetching fields.");
      }
    },

    async updateCollectionFields(
      collectionSlug: string,
      updatedFields: Field[]
    ) {
      const { $supabase } = useNuxtApp();

      this.isLoading = true;

      if (!(await this.checkPermissions("canEdit"))) return false;

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

      if (!(await this.checkPermissions("canAddFields"))) return false;

      try {
        console.log(
          "Fetching collection ID for collectionSlug:",
          collectionSlug
        );
        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .eq("organization_id", authStore.org_id)
          .single();

        if (collectionError) {
          console.error("Error fetching collection data:", collectionError);
          throw new Error(`Collection not found: ${collectionError.message}`);
        }

        console.log("Collection data fetched:", collectionData);

        // Insert fields with the collection_id
        const { error: insertError } = await $supabase.from("fields").insert(
          newFields.map((field) => ({
            ...field,
            collection_id: collectionData.id,
          }))
        );

        if (insertError) {
          console.error("Error inserting new fields:", insertError);
          throw new Error(`Failed to add new fields: ${insertError.message}`);
        }

        return true;
      } catch (err) {
        console.error("Failed to add new fields:", err);
        throw err;
      }
    },

    resetContent() {
      this.fields = [];
    },
  },
});
