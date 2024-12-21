import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    id: null as string | null, // Auth user ID from `auth.users`
    userId: null as string | null, // User ID from `public.users`
    email: null as string | null,
    role: null as string | null,
    darkmode: false,
    org_id: null as string | null,
    isAuthenticated: false,
    error: null as string | null,
  }),

  persist: true, // Persist state across reloads
  actions: {
    // Fetch and set user metadata from `public.users`
    async fetchUserMetadata() {
      const { $supabase } = useNuxtApp();
      if (!this.id) {
        console.warn("[Auth Store] No user ID found, cannot fetch metadata.");
        return;
      }

      try {
        const { data, error } = await $supabase
          .from("users") // public.users table
          .select("userId, role, darkmode, org_id")
          .eq("auth_user_id", this.id)
          .single();

        if (error) throw error;

        // Set user metadata
        this.role = data.role;
        this.darkmode = data.darkmode;
        this.userId = data.userId;
        this.org_id = data.org_id;

        console.log("[Auth Store] User metadata fetched:", data);
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
      const theme = this.darkmode ? "dark" : "light";
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(theme);
    },

    // Toggle dark mode and update preference in Supabase
    async toggleDarkMode() {
      const { $supabase } = useNuxtApp();

      this.darkmode = !this.darkmode;
      this.applyDarkMode();

      if (this.id) {
        try {
          const { error } = await $supabase
            .from("users")
            .update({ darkmode: this.darkmode })
            .eq("auth_user_id", this.id);

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
      this.role = null;
      this.darkmode = false;
      this.org_id = null;
      this.isAuthenticated = false;
      this.error = null;

      // Reset to light mode
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    },
  },
});
