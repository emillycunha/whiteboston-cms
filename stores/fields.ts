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

interface fieldsStoreState {
  fields: Field[];
  isLoading: boolean;
  isLoadingBySlug: Record<string, boolean>;
}

export const useFieldsStore = defineStore("field", {
  state: (): fieldsStoreState => ({
    fields: [],
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

    async fetchCollectionFields(collectionSlug: string) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      this.isLoading = true;

      try {
        if (!(await this.checkPermissions("canView"))) {
          console.log("[Field Store] Permission check failed.");
          return false;
        }

        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .eq("organization_id", authStore.org_id)
          .single();

        if (collectionError) {
          throw new Error(`Collection not found: ${collectionError.message}`);
        }

        // Save collection ID to be used later
        const collectionId = collectionData.id;

        const { data: fieldsData, error: fieldsError } = await $supabase
          .from("fields")
          .select("*")
          .eq("collection_id", collectionId)
          .order("position", { ascending: true });

        if (fieldsError) {
          throw new Error(`Failed to fetch fields: ${fieldsError.message}`);
        }

        this.fields = fieldsData
          .map((field) => ({
            id: field.id || 0,
            name: field.label || field.name || "Unnamed Field",
            key:
              field.key || `field_${Math.random().toString(36).substr(2, 5)}`,
            label: field.label || "Unnamed Field",
            type: field.type || "text",
            value: field.value || "",
            is_required: field.is_required || false,
            options: Array.isArray(field.options) ? field.options : [],
            optionsString: Array.isArray(field.options)
              ? field.options
                  .map((option: { label: string }) => option.label)
                  .join(", ")
              : "",
            position: field.position || 0,
            collection_id: field.collection_id || null,
          }))
          .sort((a, b) => a.position - b.position);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error("[Field Store] Error fetching fields:", errorMessage);
        notificationStore.showNotification(
          NotificationType.Error,
          errorMessage
        );
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
      const notificationStore = useNotificationStore();

      this.isLoading = true;

      try {
        if (!(await this.checkPermissions("canEdit"))) return false;

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
                ? field.options
                : null,
          })),

          { onConflict: "id" }
        );

        if (error) throw new Error(`Failed to update fields: ${error.message}`);

        notificationStore.showNotification(
          NotificationType.Success,
          "Fields updated successfully!"
        );
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error("[Field Store] Error updating fields:", errorMessage);
        notificationStore.showNotification(
          NotificationType.Error,
          errorMessage
        );
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async addNewCollectionFields(collectionSlug: string, newFields: Field[]) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      try {
        if (!(await this.checkPermissions("canAddFields"))) return false;

        const { data: collectionData, error: collectionError } = await $supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionSlug)
          .eq("organization_id", authStore.org_id)
          .single();

        if (collectionError) {
          throw new Error(`Collection not found: ${collectionError.message}`);
        }

        const { error: insertError } = await $supabase.from("fields").insert(
          newFields.map((field) => ({
            ...field,
            collection_id: collectionData.id,
          }))
        );

        if (insertError) {
          throw new Error(`Failed to add new fields: ${insertError.message}`);
        }

        notificationStore.showNotification(
          NotificationType.Success,
          "Fields added successfully!"
        );

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error("[Field Store] Error adding new fields:", errorMessage);
        notificationStore.showNotification(
          NotificationType.Error,
          errorMessage
        );
        return false;
      }
    },

    resetContent() {
      this.fields = [];
    },
  },
});
