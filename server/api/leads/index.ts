export default defineEventHandler(async () => {
  try {
    const db = hubDatabase();
    const { results } = await db.prepare("SELECT * FROM leads").all();
    console.log("Fetched leads:", results);

    return results;
  } catch (err) {
    // Ensure err is treated as an Error type
    if (err instanceof Error) {
      console.error("Error fetching leads:", err.message);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch leads",
        data: err.message,
      });
    }

    // Handle other types of unknown errors if necessary
    throw createError({
      statusCode: 500,
      statusMessage: "An unknown error occurred",
    });
  }
});
