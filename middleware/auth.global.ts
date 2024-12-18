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

  if (!$supabase) {
    console.error("[Auth Middleware] Supabase client is undefined.");
    return;
  }

  // Get the authenticated user
  const {
    data: { user },
    error,
  } = await $supabase.auth.getUser();

  if (error) {
    console.error("[Auth Middleware] Error fetching user:", error.message);
  }

  console.log("[Auth Middleware] User:", user);

  // Redirect to login if not authenticated
  if (!user) {
    console.log("[Auth Middleware] User not authenticated. Redirecting...");
    return navigateTo("/auth/login");
  }
});
