import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const token = process.env.DISCORD_TOKEN || process.env.BOT_TOKEN;
const appId = process.env.APP_ID || process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // set this for instant guild commands

if (!token || !appId) {
  console.error('Missing DISCORD_TOKEN/BOT_TOKEN or APP_ID/CLIENT_ID env vars.');
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
      console.warn('Skipping', file, e);
    }
  }
  return { cmds, names };
}

(async () => {
  const { cmds, names } = await loadCommands();
  console.log(`Found ${cmds.length} commands:`, names.sort().join(', ') || '(none)');

  const rest = new REST({ version: '10' }).setToken(token);
  try {
    if (guildId) {
      const data: any = await rest.put(
        Routes.applicationGuildCommands(appId, guildId),
        { body: cmds }
      );
      console.log(`Registered ${Array.isArray(data)? data.length : 0} guild commands to ${guildId}`);
    } else {
      const data: any = await rest.put(
        Routes.applicationCommands(appId),
        { body: cmds }
      );
      console.log(`Registered ${Array.isArray(data)? data.length : 0} GLOBAL commands (may take up to 1 hour to appear)`);
    }
  } catch (err) {
    console.error('Register error:', err);
    process.exit(1);
  }
})();
