import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('logs_private').setDescription('View your private logs');
export async function execute(i:any){ const logs=await prisma.logEntry.findMany({ where:{ guildId:i.guildId!, userId:i.user.id, private:true }, orderBy:{ createdAt:'desc' }, take:10 }); const lines=logs.map(l=>`• ${l.content} — <t:${Math.floor(new Date(l.createdAt).getTime()/1000)}:R>`); await i.reply({ content: lines.join('\n') || 'No private logs.' , ephemeral:true } as any); }
