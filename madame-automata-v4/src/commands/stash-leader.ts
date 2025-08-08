import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('stash-leader').setDescription('Gem leaderboard');
export async function execute(i:any){ const top=await prisma.profile.findMany({ where:{ guildId:i.guildId! }, orderBy:{ gems:'desc' }, take:10 }); const lines=top.map((p,idx)=>`${idx+1}. <@${p.userId}> — ${p.gems} 💎`); await i.reply({ content: lines.join('\n') || 'No data.' }); }
