import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('jail-escape').setDescription('Attempt to escape jail');
export async function execute(i:any){ const j=await prisma.jail.findFirst({ where:{ guildId:i.guildId!, userId:i.user.id } }); if(!j) return i.reply({ content:'You are not jailed.',ephemeral:true}); if(Math.random()>0.8){ await prisma.jail.delete({ where:{ id:j.id } }); return i.reply({ content:'You escaped… for now.'}); } await i.reply({ content:'You rattle the bars. No luck.'}); }
