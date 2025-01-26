import { defineStore } from "pinia";
import { useMyPermissionsStore } from "~/stores/permissions";
import { useNotificationStore } from "~/stores/notification";

type Role = "SuperAdmin" | "admin" | "user" | "viewer";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    id: null as string | null, // Auth user ID from `auth.users`
    email: null as string | null,
    name: null as string | null,
    org_id: null as string | null,
    preferences: {} as Record<string, any>,
    role: null as Role | null,
    isAuthenticated: false,
    error: null as string | null,
  }),

  persist: true,

  getters: {
    isRoleValid: (state) => state.role !== null,

    // Directly access permissions store inside each getter
    canView: () => {
      const permissionsStore = useMyPermissionsStore();
      return permissionsStore.hasPermission("canView");
    },
    canAddContent: () => {
      const permissionsStore = useMyPermissionsStore();
      return permissionsStore.hasPermission("canAddContent");
    },
    canAddFields: () => {
      const permissionsStore = useMyPermissionsStore();
      return permissionsStore.hasPermission("canAddFields");
    },
    canAddCollections: () => {
      const permissionsStore = useMyPermissionsStore();
      return permissionsStore.hasPermission("canAddCollections");
    },
    canEdit: () => {
      const permissionsStore = useMyPermissionsStore();
      return permissionsStore.hasPermission("canEdit");
    },
    canDelete: () => {
      const permissionsStore = useMyPermissionsStore();
      return permissionsStore.hasPermission("canDelete");
    },
    canManage: () => {
      const permissionsStore = useMyPermissionsStore();
      return permissionsStore.hasPermission("canManage");
    },
    canManageOrganizations: () => {
      const permissionsStore = useMyPermissionsStore();
      return permissionsStore.hasPermission("canManageOrganizations");
    },
  },

  actions: {
    // Fetch user metadata from Supabase
    async fetchUserMetadata() {
      const { $supabase } = useNuxtApp();

      if (!this.id) {
        console.warn("[Auth Store] No user ID found, cannot fetch metadata.");
        return;
      }

      if (this.name && this.org_id && this.role) {
        console.log("[Auth Store] User metadata already cached.");
        return;
      }

      try {
        // Fetch user metadata from `public.users`
        const { data: userData, error: userError } = await $supabase
          .from("users")
          .select("*")
          .eq("id", this.id)
          .single();

        if (userError) throw userError;

        // Fetch organization and role from `organization_members`
        const { data: memberData, error: memberError } = await $supabase
          .from("organization_members")
          .select("organization_id, role")
          .eq("user_id", this.id)
          .single();

        if (memberError) throw memberError;

        // Update store state
        this.name = userData.name;
        this.preferences = userData.preferences || {};
        this.org_id = memberData.organization_id;
        this.role = memberData.role;

        // Update permissions store
        const permissionsStore = useMyPermissionsStore();
        permissionsStore.setRole(this.role);
      } catch (err) {
        console.error("[Auth Store] Failed to fetch user metadata:", err);
        this.error = "Failed to load user metadata.";
      }
    },

    // Initialize user session from Supabase Auth
    async initializeAuthSession() {
      const { $supabase } = useNuxtApp();

      if (this.isAuthenticated) {
        console.log("[Auth Store] User is already authenticated.");
        return;
      }

      try {
        const {
          data: { session },
          error,
        } = await $supabase.auth.getSession();

        if (error) throw error;

        if (session && session.user) {
          console.log("[Auth Store] Session user found:", session.user);

          this.id = session.user.id ?? null;
          this.email = session.user.email ?? null;
          this.isAuthenticated = true;

          // Fetch additional user metadata
          await this.fetchUserMetadata();

          // Apply dark mode
          this.applyDarkMode();
        } else {
          console.warn("[Auth Store] No active session.");
          this.resetState();
        }
      } catch (err) {
        console.error("[Auth Store] Failed to initialize session:", err);
        this.resetState();
      }
    },

    // Login user using email and password
    async login(email: string, password: string) {
      const { $supabase } = useNuxtApp();

      try {
        const {
          data: { user },
          error,
        } = await $supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        this.id = user?.id ?? null;
        this.email = user?.email ?? null;
        this.isAuthenticated = true;

        console.log("[Auth Store] Login successful:", user);

        // Fetch additional user metadata
        await this.fetchUserMetadata();

        // Apply dark mode
        this.applyDarkMode();
      } catch (err) {
        console.error("[Auth Store] Login failed:", err);
        this.error = "Login failed. Please check your credentials.";
        throw err; // Allow the login page to handle the error if needed
      }
    },

    // Logout user and clear state
    async logout() {
      const { $supabase } = useNuxtApp();

      try {
        const { error } = await $supabase.auth.signOut();
        if (error) throw error;

        console.log("[Auth Store] Logout successful.");
        this.resetState();
      } catch (err) {
        console.error("[Auth Store] Logout failed:", err);
        this.error = "Failed to log out. Please try again.";
      }
    },

    // Save profile data (name, email, password)
    // Save profile data (name, email, password)
    async saveProfile(updatedFields: {
      name?: string;
      email?: string;
      password?: string;
    }) {
      const { $supabase } = useNuxtApp();
      const notificationStore = useNotificationStore();

      try {
        if (updatedFields.name && updatedFields.name !== this.name) {
          const { error: nameError } = await $supabase
            .from("users")
            .update({ name: updatedFields.name })
            .eq("id", this.id);

          if (nameError) {
            notificationStore.showNotification(
              NotificationType.Error,
              `Error updating name: ${nameError.message}`
            );
            console.error("Error updating name:", nameError.message);
            return;
          }

          this.name = updatedFields.name;
          notificationStore.showNotification(
            NotificationType.Success,
            "Name updated successfully."
          );
        }

        if (updatedFields.email && updatedFields.email !== this.email) {
          const { error: emailError } = await $supabase.auth.updateUser({
            email: updatedFields.email,
          });

          if (emailError) {
            notificationStore.showNotification(
              NotificationType.Error,
              `Error updating email: ${emailError.message}`
            );
            console.error("Error updating email:", emailError.message);
            return;
          }

          this.email = updatedFields.email;
          notificationStore.showNotification(
            NotificationType.Success,
            "Email updated successfully."
          );
        }

        if (updatedFields.password) {
          const { error: passwordError } = await $supabase.auth.updateUser({
            password: updatedFields.password,
          });

          if (passwordError) {
            notificationStore.showNotification(
              NotificationType.Error,
              `Error updating password: ${passwordError.message}`
            );
            console.error("Error updating password:", passwordError.message);
            return;
          }

          notificationStore.showNotification(
            NotificationType.Success,
            "Password updated successfully."
          );
        }
      } catch (err) {
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while updating profile."
        );
        console.error("Unexpected error:", err);
      }
    },

    // Apply dark mode theme
    applyDarkMode() {
      const darkmode = this.preferences?.darkmode ?? false;

      // Log the current dark mode state
      console.log("[applyDarkMode] Current darkmode state:", darkmode);

      if (darkmode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("darkmode", "true");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("darkmode", "false");
      }
    },

    // Toggle dark mode and update preference in Supabase
    async toggleDarkMode() {
      const { $supabase } = useNuxtApp();

      this.preferences.darkmode = !this.preferences.darkmode;
      console.log(
        "[toggleDarkMode] Darkmode toggled to:",
        this.preferences.darkmode
      );

      this.applyDarkMode();

      // Update the preferences in Supabase after the UI update
      if (this.id) {
        try {
          const { error } = await $supabase
            .from("users")
            .update({ preferences: this.preferences })
            .eq("id", this.id);

          if (error) throw error;
          console.log("[Auth Store] Dark mode preference updated.");
        } catch (err) {
          console.error("[Auth Store] Failed to update dark mode:", err);
        }
      }
    },

    async updatePreferences(updatedPreferences: Record<string, any>) {
      const { $supabase } = useNuxtApp();
      const notificationStore = useNotificationStore();

      if (!this.id) {
        notificationStore.showNotification(
          NotificationType.Error,
          "User ID is missing. Cannot update preferences."
        );
        console.error(
          "[Auth Store] User ID is missing. Cannot update preferences."
        );
        return false;
      }

      try {
        const { data, error } = await $supabase
          .from("users")
          .update({ preferences: updatedPreferences })
          .eq("id", this.id)
          .select("*");

        if (error) {
          notificationStore.showNotification(
            NotificationType.Error,
            "Failed to update preferences. Please try again."
          );
          console.error("[Auth Store] Failed to update preferences:", error);
          return false;
        }

        this.preferences = updatedPreferences;

        notificationStore.showNotification(
          NotificationType.Success,
          "Preferences updated successfully."
        );
        console.log("[Auth Store] Preferences updated successfully:", data);
        return true;
      } catch (err) {
        notificationStore.showNotification(
          NotificationType.Error,
          "An unexpected error occurred while updating preferences."
        );
        console.error("[Auth Store] Error updating preferences:", err);
        return false;
      }
    },

    // Reset auth state
    resetState() {
      this.id = null;
      this.email = null;
      this.org_id = null;
      this.preferences = {};
      this.role = null;
      this.isAuthenticated = false;
      this.error = null;

      // Reset to light mode
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    },
  },
});
