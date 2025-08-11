
import "dotenv/config";
import { Client, GatewayIntentBits, Partials, Collection, REST, Routes } from "discord.js";
import { loadAll, loadCommandsForRegistration } from "./util/loadCommands.js";
import { prisma } from "./lib/prisma.js";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;
const registerOnBoot = (process.env.REGISTER_ON_BOOT || "true").toLowerCase() === "true";
const registerGlobal = (process.env.REGISTER_GLOBAL || "false").toLowerCase() === "true";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

// Error handler for interactions to prevent timeouts without feedback
import { handleComponent } from "./components.js";

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isButton() || interaction.isStringSelectMenu()) return handleComponent(interaction);
    if (!interaction.isChatInputCommand()) return;
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    await cmd.run(interaction, client);
  } catch (err) {
    console.error(err);
    const reply = { content: "Something went wrong. Staff has been notified.", ephemeral: true };
    try {
      if (interaction.deferred || interaction.replied) await interaction.followUp(reply);
      else await interaction.reply(reply);
    } catch {}
  }
});

import { onMessage } from "./message-monitor.js";

client.once("ready", async () => {
  console.log(`[ready] Logged in as ${client.user.tag}`);

  // auto register commands
  if (registerOnBoot) {
    const rest = new REST({ version: "10" }).setToken(token);
    const body = loadCommandsForRegistration();
    try {
      if (registerGlobal) {
        await rest.put(Routes.applicationCommands(clientId), { body });
        console.log("[register] Synced commands globally");
      } else {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body });
        console.log("[register] Synced commands to guild", guildId);
      }
    } catch (e) {
      console.error("[register] Failed:", e);
    }
  }
});

// Load command modules
for (const cmd of loadAll()) {
  client.commands.set(cmd.data.name, cmd);
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

client.login(token);

client.on("messageCreate", onMessage);
