import { schedule } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NUXT_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.NUXT_SERVICE_ROLE_KEY;
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

console.log("🔄 Starting keep-alive function...");
console.log("🔑 Supabase URL:", supabaseUrl ? "✅ Set" : "❌ MISSING");
console.log("🔑 Service Role Key:", supabaseServiceRoleKey ? "✅ Set" : "❌ MISSING");
console.log("🔔 Discord Webhook:", discordWebhookUrl ? "✅ Set" : "❌ MISSING");

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// ✅ Rename the function to avoid redeclaration issues
const keepAliveFunction = async function () {
  console.log("🔄 Running weekly keep-alive function...");

  try {
    console.log(`🔑 Supabase URL: ${supabaseUrl ? "✅ Set" : "❌ Not Set"}`);
    console.log(`🔑 Service Role Key: ${supabaseServiceRoleKey ? "✅ Set" : "❌ Not Set"}`);

    // ✅ Perform a simple query to check if Supabase is alive
    const { data, error } = await supabase.from("users").select("id").limit(1);

    if (error) {
      console.error("❌ Supabase Query Error:", error);
      await sendDiscordNotification(`❌ **Supabase Error:** ${error.message}`);
      return { statusCode: 500, body: JSON.stringify({ error: "Failed to keep Supabase active.", details: error }) };
    }

    console.log("✅ Supabase is active!", data);
    await sendDiscordNotification("✅ **Supabase Keep-Alive Check Passed!** Supabase is active.");

    return { statusCode: 200, body: JSON.stringify({ message: "Keep-alive check completed." }) };
  } catch (err) {
    console.error("❌ Unexpected Error:", err);
    await sendDiscordNotification(`❌ **Unexpected Error:** ${err.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unexpected error occurred.", details: err.message }),
    };
  }
};

// ✅ Function to send a message to Discord
const sendDiscordNotification = async (message) => {
  if (!discordWebhookUrl) {
    console.warn("⚠️ Discord Webhook URL is missing. Skipping notification.");
    return;
  }

  try {
    await fetch(discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
    console.log("✅ Discord notification sent!");
  } catch (error) {
    console.error("❌ Failed to send Discord notification:", error);
  }
};

// ✅ Export the scheduled function correctly
export const handler = schedule("@daily", keepAliveFunction);
