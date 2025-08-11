import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  REST,
  Routes
} from "discord.js";
import { loadAll, loadCommandsForRegistration } from "./util/loadCommands.js";
import { prisma } from "./lib/prisma.js";
import { handleComponent } from "./components.js"; // keeps task buttons working

// --- env diagnostics ---
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;
const registerOnBoot = (process.env.REGISTER_ON_BOOT || "true").toLowerCase() === "true";
const registerGlobal = (process.env.REGISTER_GLOBAL || "false").toLowerCase() === "true";

console.log("[env] clientId:", clientId || "(missing)");
console.log("[env] guildId:", guildId || "(missing)");
console.log("[env] registerOnBoot:", registerOnBoot, "registerGlobal:", registerGlobal);
if (!token) console.warn("[env] DISCORD_TOKEN is missing!");

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

// Load command modules
for (const cmd of loadAll()) {
  client.commands.set(cmd.data.name, cmd);
}
console.log("[boot] loaded commands:", [...client.commands.keys()].join(", ") || "(none)");

client.once("ready", async () => {
  console.log(`[ready] Logged in as ${client.user.tag}`);

  if (registerOnBoot) {
    if (!clientId || (!registerGlobal && !guildId)) {
      console.warn("[register] Skipping: missing CLIENT_ID or GUILD_ID");
    } else {
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
  }
});

// Universal interaction handler with “no‑timeout” safety
client.on("interactionCreate", async (interaction) => {
  try {
    // component interactions (buttons/selects)
    if (interaction.isButton() || interaction.isStringSelectMenu()) {
      return handleComponent(interaction);
    }

    // slash commands
    if (!interaction.isChatInputCommand()) return;

    const name = interaction.commandName;
    const cmd = client.commands.get(name);
    if (!cmd) {
      return interaction.reply({ content: "Unknown command.", ephemeral: true }).catch(() => {});
    }

    // --- anti-timeout shim ---
    let responded = false;
    const originalReply = interaction.reply.bind(interaction);
    interaction.reply = async (opts) => {
      responded = true;
      try { return await originalReply(opts); }
      catch (e) {
        // If we already deferred, fall back to followUp
        if (interaction.deferred || interaction.replied) {
          return interaction.followUp(opts);
        }
        throw e;
      }
    };

    // Safeguard: if nothing replied within ~2.5s, defer ephemerally to stop "application didn't respond"
    const timer = setTimeout(async () => {
      if (!responded && !interaction.deferred && !interaction.replied) {
        try { await interaction.deferReply({ ephemeral: true }); } catch {}
      }
    }, 2500);

    await cmd.run(interaction, client);
    clearTimeout(timer);
  } catch (err) {
    console.error("[command error]", err);
    const reply = { content: "Something went wrong. Staff has been notified.", ephemeral: true };
    try {
      if (interaction.deferred || interaction.replied) await interaction.followUp(reply);
      else await interaction.reply(reply);
    } catch {}
  }
});

process.on("SIGINT", async () => { await prisma.$disconnect(); process.exit(0); });
process.on("SIGTERM", async () => { await prisma.$disconnect(); process.exit(0); });

client.login(token);

