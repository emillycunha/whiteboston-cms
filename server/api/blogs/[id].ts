export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || "", 10);

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid blog ID" });
  }

  try {
    const db = hubDatabase();
    const { results } = await db
      .prepare("SELECT * FROM blogs WHERE id = ?")
      .bind(id)
      .all();

    if (results.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `Blog with ID ${id} not found`,
      });
    }

    return results[0];
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unknown error occurred.";
    console.error(`[API] Error fetching blog with ID ${id}:`, message);
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
