export default defineNuxtRouteMiddleware(async (to) => {
  console.log("[Auth Middleware] Checking authentication...");

  // Skip the middleware for the login page
  if (to.path === "/auth/login") {
    console.log("[Auth Middleware] Skipping for /auth/login");
    return;
  }

  // Ensure this doesn't run on the server
  if (process.server) return;

  const { $supabase } = useNuxtApp();
  const authStore = useAuthStore();

  // If the session is already initialized, skip re-fetching
  if (authStore.isAuthenticated) {
    console.log("[Auth Middleware] User already authenticated.");
    return;
  }

  // Fetch the authenticated user from Supabase
  const {
    data: { user },
    error,
  } = await $supabase.auth.getUser();

  if (error) {
    console.error("[Auth Middleware] Error fetching user:", error.message);
    return navigateTo("/auth/login");
  }

  console.log("[Auth Middleware] User:", user);

  // Redirect to login if not authenticated
  if (!user) {
    console.log("[Auth Middleware] User not authenticated. Redirecting...");
    return navigateTo("/auth/login");
  }

  // Initialize the session in authStore
  authStore.id = user.id ?? null; // auth.users ID
  authStore.email = user.email ?? null;
  authStore.isAuthenticated = true;

  console.log("[Auth Middleware] Initializing user session...");
  await authStore.fetchUserMetadata(); // Fetch from public.users
  authStore.applyDarkMode();
});
