export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || "", 10);

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid blog ID" });
  }

  const body = await readBody(event);

  try {
    const db = hubDatabase();
    await db
      .prepare(
        `UPDATE blogs
           SET title = ?, description = ?, content = ?, category = ?, tags = ?, updated_at = DATETIME('now')
           WHERE id = ?`
      )
      .bind(
        body.title || null,
        body.description || null,
        body.content || null,
        body.category || null,
        body.tags || null,
        body.updated_at || null,
        id
      )
      .run();

    // Fetch and return the updated blog
    const { results } = await db
      .prepare("SELECT * FROM blogs WHERE id = ?")
      .bind(id)
      .all();

    console.log(`[API] Blog with ID ${id} updated successfully.`);
    return results[0];
  } catch (err) {
    console.error(`[API] Failed to update blog with ID ${id}:`, err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update the blog",
    });
  }
});
