
import "dotenv/config";
import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { loadCommandsForRegistration } from "./util/loadCommands.js";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;
const global = (process.env.REGISTER_GLOBAL || "false").toLowerCase() === "true";

const rest = new REST({ version: "10" }).setToken(token);

const commands = loadCommandsForRegistration();

async function main() {
  if (global) {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log("[register] Registered commands globally");
  } else {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log("[register] Registered commands to guild", guildId);
  }
}
main().catch(console.error);
