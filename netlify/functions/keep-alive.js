import { schedule } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NUXT_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.NUXT_SERVICE_ROLE_KEY;
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const keepAliveFunction = async function () {
  console.log("🔄 Running weekly keep-alive function...");

  try {
    // ✅ Perform a simple query to keep Supabase active
    const { data, error } = await supabase.from("user_list").select("id").limit(1);

    if (error) {
      console.error("❌ Supabase Query Error:", error.message);
      await sendDiscordMessage("❌ Supabase Query Error: " + error.message);
      return { statusCode: 500, body: JSON.stringify({ error: "Failed to keep Supabase active." }) };
    }

    console.log("✅ Supabase is active!", data);
    await sendDiscordMessage("✅ Supabase Keep-Alive Function ran successfully!");

    return { statusCode: 200, body: JSON.stringify({ message: "Keep-alive check completed." }) };
  } catch (err) {
    console.error("❌ Unexpected Error:", err.message);
    await sendDiscordMessage("❌ Unexpected Error: " + err.message);
    return { statusCode: 500, body: JSON.stringify({ error: "Unexpected error occurred." }) };
  }
};

// ✅ Function to Send Message to Discord
async function sendDiscordMessage(message) {
  if (!discordWebhookUrl) {
    console.error("❌ Discord Webhook URL is missing!");
    return;
  }

  await fetch(discordWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  }).catch((err) => console.error("❌ Error sending Discord message:", err.message));
}

// ✅ Export the function correctly
export const handler = schedule("0 0 * * 0", keepAliveFunction);
