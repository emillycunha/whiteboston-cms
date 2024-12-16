import { defineEventHandler, readBody } from "h3";

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown error occurred";
}

export default defineEventHandler(async (event) => {
  const db = hubDatabase();

  if (event.req.method === "POST") {
    const newBlog = await readBody(event);

    // Validate required fields
    if (!newBlog.title || !newBlog.content || !newBlog.slug) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields: title, content, or slug",
      });
    }

    // Set defaults
    const createdAt = new Date().toISOString();
    const status = newBlog.status || "published";

    try {
      const result = await db
        .prepare(
          "INSERT INTO blogs (title, description, category, content, created_at, tags, slug, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(
          newBlog.title,
          newBlog.description,
          newBlog.category,
          newBlog.content,
          createdAt,
          newBlog.tags,
          newBlog.slug,
          status
        )
        .run();

      // Retrieve the last inserted ID
      const lastInsertId = result.meta.last_row_id;

      return {
        id: lastInsertId,
        title: newBlog.title,
        description: newBlog.description,
        category: newBlog.category,
        content: newBlog.content,
        created_at: createdAt,
        tags: newBlog.tags,
        slug: newBlog.slug,
        status,
      };
    } catch (err) {
      console.error("Error creating blog:", getErrorMessage(err));
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create blog",
        data: getErrorMessage(err),
      });
    }
  } else if (event.req.method === "GET") {
    // Fetch all blogs
    try {
      const { results } = await db.prepare("SELECT * FROM blogs").all();
      return results;
    } catch (err) {
      console.error("Error fetching blogs:", getErrorMessage(err));
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch blogs",
        data: getErrorMessage(err),
      });
    }
  } else {
    // Unsupported methods
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }
});
