import { defineStore } from "pinia";
import {
  permissions,
  hasPermission,
  useMyPermissionsStore,
} from "~/stores/permissions";

type Role = "SuperAdmin" | "admin" | "user" | "viewer";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    id: null as string | null, // Auth user ID from `auth.users`
    email: null as string | null,
    name: null as string | null,
    org_id: null as string | null,
    preferences: {} as Record<string, any>,
    role: null as Role | null, // "SuperAdmin", "admin", "user", "viewer"
    isAuthenticated: false,
    error: null as string | null,
  }),

  persist: true,

  getters: {
    isRoleValid: (state) => state.role !== null,
    hasPermission:
      (state) => (action: keyof (typeof permissions)["SuperAdmin"]) => {
        return hasPermission(state.role, action);
      },
    canView: (state) => hasPermission(state.role, "canView"),
    canAddContent: (state) => hasPermission(state.role, "canAddContent"),
    canAddFields: (state) => hasPermission(state.role, "canAddFields"),
    canAddCollections: (state) =>
      hasPermission(state.role, "canAddCollections"),
    canEdit: (state) => hasPermission(state.role, "canEdit"),
    canDelete: (state) => hasPermission(state.role, "canDelete"),
    canManageOrganizations: (state) =>
      hasPermission(state.role, "canManageOrganizations"),
  },

  actions: {
    // Fetch and set user metadata from `public.users` and `organization_members`
    async fetchUserMetadata() {
      const { $supabase } = useNuxtApp();

      if (!this.id) {
        console.warn("[Auth Store] No user ID found, cannot fetch metadata.");
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
    async saveProfile(updatedFields: {
      name?: string;
      email?: string;
      password?: string;
    }) {
      const { $supabase } = useNuxtApp();

      try {
        //let { error } = null;

        if (updatedFields.name) {
          // Update the name in the `users` table
          const { data, error: nameError } = await $supabase
            .from("users")
            .update({ name: updatedFields.name })
            .eq("id", this.id);
          if (nameError) {
            this.error = nameError.message;
            console.error("Error updating name:", nameError.message);
            this.error = nameError.message;
            return;
          }
          this.name = updatedFields.name;
        }

        if (updatedFields.email) {
          const { data, error: emailError } = await $supabase.auth.updateUser({
            email: updatedFields.email,
          });
          if (emailError) {
            console.error("Error updating email:", emailError.message);

            this.error = emailError.message;
            return;
          }
          this.email = updatedFields.email;
        }

        if (updatedFields.password) {
          const { error: passwordError } = await $supabase.auth.updateUser({
            password: updatedFields.password,
          });
          if (passwordError) {
            this.error = passwordError.message;
            return;
          }
        }

        this.error = null;
      } catch (err) {
        this.error = "An unexpected error occurred.";
        console.error(err);
      }
    },

    // Apply dark mode theme
    applyDarkMode() {
      const darkmode = this.preferences?.darkmode ?? false;
      const theme = darkmode ? "dark" : "light";
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(theme);
    },

    // Toggle dark mode and update preference in Supabase
    async toggleDarkMode() {
      const { $supabase } = useNuxtApp();

      const darkmode = !(this.preferences?.darkmode ?? false);
      this.preferences = { ...this.preferences, darkmode };
      this.applyDarkMode();

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

      if (!this.id) {
        console.error(
          "[Auth Store] User ID is missing. Cannot update preferences."
        );
        return false;
      }

      try {
        // Update preferences in the database
        const { data, error } = await $supabase
          .from("users")
          .update({ preferences: updatedPreferences })
          .eq("id", this.id)
          .select("*");

        if (error) {
          console.error("[Auth Store] Failed to update preferences:", error);
          return false;
        }

        // Update preferences in the local store
        this.preferences = updatedPreferences;

        console.log("[Auth Store] Preferences updated successfully:", data);
        return true;
      } catch (err) {
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
