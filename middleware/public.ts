export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/" || to.path.startsWith("/docs")) {
    console.log("[Public Middleware] Allowing public access.");
    return;
  }
});
