// scripts/commands-cleanup.js
import "dotenv/config";
import { REST, Routes } from "discord.js";

const token   = process.env.DISCORD_TOKEN;
const clientId= process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

const rest = new REST({ version: "10" }).setToken(token);

const arg = process.argv[2] || "--list";

async function main() {
  if (!token || !clientId) {
    console.error("[cleanup] Missing DISCORD_TOKEN or DISCORD_CLIENT_ID");
    process.exit(1);
  }
  if (arg === "--list") {
    const globalCmds = await rest.get(Routes.applicationCommands(clientId));
    const guildCmds  = guildId ? await rest.get(Routes.applicationGuildCommands(clientId, guildId)) : [];
    console.log("[list] global:", globalCmds.map(c=>c.name));
    console.log("[list] guild :", guildCmds.map(c=>c.name));
    return;
  }
  if (arg === "--wipe-global") {
    await rest.put(Routes.applicationCommands(clientId), { body: [] });
    console.log("[wipe] cleared ALL global commands");
    return;
  }
  if (arg === "--wipe-guild") {
    if (!guildId) throw new Error("DISCORD_GUILD_ID required for --wipe-guild");
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
    console.log("[wipe] cleared ALL guild commands for", guildId);
    return;
  }
  console.log("Usage:");
  console.log("  node scripts/commands-cleanup.js --list");
  console.log("  node scripts/commands-cleanup.js --wipe-global");
  console.log("  node scripts/commands-cleanup.js --wipe-guild");
}
main().catch(e => (console.error(e), process.exit(1)));
