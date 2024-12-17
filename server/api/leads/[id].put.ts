export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || "", 10);

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid lead ID" });
  }

  const body = await readBody(event);

  try {
    const db = hubDatabase();
    await db
      .prepare(
        `UPDATE leads
             SET name = ?, email = ?, phone = ?, interest = ?
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

    // Fetch and return the updated lead
    const { results } = await db
      .prepare("SELECT * FROM leads WHERE id = ?")
      .bind(id)
      .all();

    console.log(`[API] Lead with ID ${id} updated successfully.`);
    return results[0];
  } catch (err) {
    console.error(`[API] Failed to update lead with ID ${id}:`, err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update the lead",
    });
  }
});
