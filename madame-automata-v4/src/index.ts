
import 'dotenv/config';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection
} from 'discord.js';

// --- HTTP keepalive so Railway doesn't kill us ---
const port = Number(process.env.PORT || 3000);
http.createServer((_, res) => {
  res.statusCode = 200;
  res.end('ok');
}).listen(port, () => console.log('HTTP keepalive on :' + port));

// --- Discord client ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User]
}) as Client & { commands?: Collection<string, any> };

// --- ENV ---
function pick(...vals: (string | undefined)[]) { return vals.find(Boolean); }
const TOKEN   = pick(process.env.DISCORD_TOKEN, process.env.BOT_TOKEN, process.env.TOKEN);

// --- Dynamic command loader ---
function isCmdFile(f: string){
  return f.endsWith('.js') || f.endsWith('.mjs') || f.endsWith('.ts');
}
function walk(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (isCmdFile(entry.name)) out.push(full);
  }
  return out;
}
async function initCommands(){
  const distDir = path.resolve('dist/commands');
  const srcDir  = path.resolve('src/commands');
  const CMD_DIR = fs.existsSync(distDir) ? distDir : srcDir;
  const files = walk(CMD_DIR);
  const names: string[] = [];
  client.commands = new Collection();
  for (const file of files) {
    try {
      const mod: any = await import(pathToFileURL(path.resolve(file)).href);
      if (mod?.data?.name && typeof mod.execute === 'function') {
        client.commands.set(mod.data.name, mod);
        names.push(mod.data.name);
      }
    } catch (e) {
      console.warn('[index] skip command', file, e);
    }
  }
  console.log(`[index] loaded ${names.length} commands:`, names.sort().join(', ') || '(none)');
}

// Optional helpers (don’t crash if missing)
let handleButton: ((i:any)=>Promise<any>)|null = null;
let startReminders: ((c:any)=>void)|null = null;
(async () => {
  try { ({ handleButton } = await import('./events/interactionButtons.js')); } catch {}
  try { ({ startReminders } = await import('./jobs/reminders.js')); } catch {}
})();

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  await initCommands();
  if (startReminders) startReminders(client);
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton() && handleButton) return handleButton(interaction);
    if (interaction.isChatInputCommand()) {
      const cmd = client.commands?.get(interaction.commandName);
      if (!cmd) return interaction.reply({ content: 'Command not loaded.', ephemeral: true });
      return await cmd.execute(interaction);
    }
  } catch (err) {
    console.error(err);
    if (interaction.isRepliable()) {
      await interaction.reply({ content: 'Something went wrong running that command.', ephemeral: true }).catch(()=>{});
    }
  }
});

if (!TOKEN) {
  console.error('Missing bot token (DISCORD_TOKEN / BOT_TOKEN / TOKEN)');
  process.exit(1);
}

client.login(TOKEN).catch(err => {
  console.error('Login failed:', err);
  process.exit(1);
});
