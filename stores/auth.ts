import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    id: null as string | null, // Auth user ID from `auth.users`
    email: null as string | null,
    name: null as string | null,
    org_id: null as string | null,
    preferences: {} as Record<string, any>,
    role: null as string | null,
    isAuthenticated: false,
    error: null as string | null,
  }),

  persist: true,

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

        console.log("[Auth Store] User metadata fetched:", {
          name: this.name,
          preferences: this.preferences,
          org_id: this.org_id,
          role: this.role,
        });
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

      const darkmode = !(this.preferences?.darkmode ?? false); // Toggle dark mode
      this.preferences = { ...this.preferences, darkmode }; // Update locally
      this.applyDarkMode();

      if (this.id) {
        try {
          const { error } = await $supabase
            .from("users")
            .update({ preferences: this.preferences }) // Update preferences in Supabase
            .eq("id", this.id);

          if (error) throw error;

          console.log("[Auth Store] Dark mode preference updated.");
        } catch (err) {
          console.error("[Auth Store] Failed to update dark mode:", err);
        }
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
