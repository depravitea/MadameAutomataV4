import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js'; import { gothicEmbed } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('view-tracker').setDescription('Top Simp & Longest Ownership');
export async function execute(i){
  const g=i.guildId!;
  const topSimp=await prisma.profile.findFirst({ where:{guildId:g}, orderBy:{simpCount:'desc'} }).catch(()=>null);
  const longest=await prisma.relationship.findFirst({ where:{guildId:g,status:'active'}, orderBy:{createdAt:'asc'} }).catch(()=>null);
  await i.reply({ embeds:[gothicEmbed('House Records',`Top Simp: ${topSimp?`<@${topSimp.userId}> (${topSimp.simpCount})`:'—'}\nLongest Ownership: ${longest?`<@${longest.domId}> × <@${longest.subId}> since <t:${Math.floor(longest?new Date((longest as any).createdAt).getTime()/1000:0)}:d>`:'—'}`)] });
}
