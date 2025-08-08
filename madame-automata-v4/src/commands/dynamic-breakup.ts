import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('dynamic-breakup').setDescription('A sub ends ownership with any Domme');
export async function execute(i:any){ const rel=await prisma.relationship.findFirst({ where:{ guildId:i.guildId!, subId:i.user.id, status:'active'} }); if(!rel) return i.reply({ content:'You are not owned.',ephemeral:true}); await prisma.relationship.update({ where:{ id:rel.id }, data:{ status:'released' } }); await i.reply({ content:`The bond is severed.` }); }
