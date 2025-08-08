import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function pick(...vals: (string | undefined)[]) {
  return vals.find(Boolean);
}
function mask(v?: string) {
  if (!v) return '(missing)';
  const s = String(v);
  if (s.length <= 8) return s[0] + '…' + s[s.length-1];
  return s.slice(0, 6) + '…' + s.slice(-4);
}

const token  = pick(process.env.DISCORD_TOKEN, process.env.BOT_TOKEN, process.env.TOKEN);
const appId  = pick(process.env.APP_ID, process.env.CLIENT_ID, process.env.APPLICATION_ID);
const guildId= pick(process.env.GUILD_ID, process.env.GUILD, process.env.SERVER_ID);

console.log('[registrar] env check =>', {
  DISCORD_TOKEN: mask(process.env.DISCORD_TOKEN),
  BOT_TOKEN: mask(process.env.BOT_TOKEN),
  TOKEN: mask(process.env.TOKEN),
  APP_ID: mask(process.env.APP_ID),
  CLIENT_ID: mask(process.env.CLIENT_ID),
  APPLICATION_ID: mask(process.env.APPLICATION_ID),
  GUILD_ID: process.env.GUILD_ID || '(none)',
  GUILD: process.env.GUILD || '(none)',
  SERVER_ID: process.env.SERVER_ID || '(none)',
  chosen: { token: mask(token), appId: mask(appId), guildId: guildId || '(none)' }
});

if (!token || !appId) {
  console.error('[registrar] Missing token or appId. See env check above.');
  process.exit(1);
}

const distDir = path.resolve('dist/commands');
const srcDir  = path.resolve('src/commands');
const CMD_DIR = fs.existsSync(distDir) ? distDir : srcDir;

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

async function loadCommands() {
  const files = walk(CMD_DIR);
  const cmds: any[] = [];
  const names: string[] = [];
  for (const file of files) {
    try {
      const mod = await import(pathToFileURL(path.resolve(file)).href);
      const data = (mod as any)?.data;
      const execute = (mod as any)?.execute;
      if (data?.toJSON && typeof execute === 'function') {
        cmds.push(data.toJSON());
        names.push(data.name);
      }
    } catch (e) {
      console.warn('[registrar] Skipping', file, e);
    }
  }
  return { cmds, names };
}

(async () => {
  const { cmds, names } = await loadCommands();
  console.log(`[registrar] Found ${cmds.length} commands:`, names.sort().join(', ') || '(none)');

  const rest = new REST({ version: '10' }).setToken(token!);
  try {
    if (guildId) {
      const data: any = await rest.put(
        Routes.applicationGuildCommands(appId!, guildId),
        { body: cmds }
      );
      console.log(`[registrar] Registered ${Array.isArray(data)? data.length : 0} guild commands to ${guildId}`);
    } else {
      const data: any = await rest.put(
        Routes.applicationCommands(appId!),
        { body: cmds }
      );
      console.log(`[registrar] Registered ${Array.isArray(data)? data.length : 0} GLOBAL commands (can take up to 1 hour)`);
    }
  } catch (err) {
    console.error('[registrar] Register error:', err);
    process.exit(1);
  }
})();
