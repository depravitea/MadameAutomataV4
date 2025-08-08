import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('user-limits').setDescription('View user limits').addUserOption(o=>o.setName('user').setDescription('User'));
export async function execute(i:any){ const u=i.options.getUser('user')||i.user; const c=await prisma.consent.findFirst({ where:{ guildId:i.guildId!, userId:u.id } }); await i.reply({ content: c?.limits || 'No limits recorded.' }); }
