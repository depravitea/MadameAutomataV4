import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('riddle-end').setDescription('End the active riddle').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
export async function execute(i:any){ const r=await prisma.riddle.findFirst({ where:{ guildId:i.guildId!, channelId:i.channelId, active:true } }); if(!r) return i.reply({ content:'No active riddle to end.',ephemeral:true}); await prisma.riddle.update({ where:{ id:r.id }, data:{ active:false } }); await i.reply({ content:'Riddle ended.' }); }
