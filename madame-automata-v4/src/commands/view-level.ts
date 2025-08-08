import { SlashCommandBuilder } from 'discord.js';
import { ensureProfile } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('view-level').setDescription('View your level (XP only)');
export async function execute(i:any){ const p=await ensureProfile(i.guildId!,i.user.id); await i.reply({ content:`You have **${p.xp}** XP.` }); }
