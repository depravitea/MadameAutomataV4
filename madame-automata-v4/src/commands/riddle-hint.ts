import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('riddle-hint').setDescription('Get a hint for the active riddle');
export async function execute(i:any){ const r=await prisma.riddle.findFirst({ where:{ guildId:i.guildId!, channelId:i.channelId, active:true } }); if(!r) return i.reply({ content:'No active riddle here.',ephemeral:true}); await i.reply({ content: r.hint || 'No hint prepared.' }); }
