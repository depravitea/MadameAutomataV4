import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
import { gothicEmbed as E } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('view-tracker').setDescription('Top Simp & Longest Ownership');
export async function execute(i:any){ const g=i.guildId!; const top=await prisma.profile.findFirst({ where:{guildId:g}, orderBy:{ simpCount:'desc' } }).catch(()=>null); const longest=await prisma.relationship.findFirst({ where:{guildId:g,status:'active'}, orderBy:{ createdAt:'asc' } }).catch(()=>null);
  const since=longest?`<t:${Math.floor(new Date(longest.createdAt).getTime()/1000)}:d>`:'—';
  await i.reply({ embeds:[E('House Records',`Top Simp: ${top?`<@${top.userId}> (${top.simpCount})`:'—'}\nLongest Ownership: ${longest?`<@${longest.domId}> × <@${longest.subId}> since ${since}`:'—'}`)] }); }
