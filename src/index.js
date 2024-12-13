export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Example: Handle the `/api/blogs` route
    if (url.pathname === "/api/blogs") {
      try {
        const db = env.DB; // Use the D1 binding from wrangler.toml

        // Query the database for blog posts
        const { results } = await db.prepare("SELECT * FROM blogs").all();

        return new Response(JSON.stringify(results), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({
            error: "Failed to fetch blogs",
            details: err.message,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Handle other routes or return 404
    return new Response("Not Found", { status: 404 });
  },
};
