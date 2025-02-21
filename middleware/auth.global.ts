export default defineNuxtRouteMiddleware(async (to) => {
  // Skip the middleware for the login page
  if (to.path === "/auth/login" || to.path === "/") {
    return;
  }

  // Ensure this doesn't run on the server
  if (process.server) return;

  const { $supabase } = useNuxtApp();
  const authStore = useAuthStore();

  // If the session is already initialized, skip re-fetching
  if (authStore.isAuthenticated) {
    return;
  }

  // Fetch the authenticated user from Supabase
  const {
    data: { user },
    error,
  } = await $supabase.auth.getUser();

  if (error) {
    return navigateTo("/auth/login");
  }

  // Redirect to login if not authenticated
  if (!user) {
    return navigateTo("/auth/login");
  }

  // Initialize the session in authStore
  authStore.id = user.id ?? null;
  authStore.email = user.email ?? null;
  authStore.isAuthenticated = true;

  if (!authStore.name) {
    await authStore.fetchUserMetadata();
    authStore.applyDarkMode();
  }
});
