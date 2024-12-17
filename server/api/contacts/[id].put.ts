export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || "", 10);

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid contact ID" });
  }

  const body = await readBody(event);

  try {
    const db = hubDatabase();
    await db
      .prepare(
        `UPDATE contacts
               SET title = ?, description = ?, content = ?, category = ?, tags = ?
               WHERE id = ?`
      )
      .bind(
        body.name || null,
        body.email || null,
        body.phone || null,
        body.interest || null,
        id
      )
      .run();

    // Fetch and return the updated contact
    const { results } = await db
      .prepare("SELECT * FROM contacts WHERE id = ?")
      .bind(id)
      .all();

    console.log(`[API] Contact with ID ${id} updated successfully.`);
    return results[0];
  } catch (err) {
    console.error(`[API] Failed to update contact with ID ${id}:`, err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update the contact",
    });
  }
});
