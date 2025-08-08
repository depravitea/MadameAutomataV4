import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('dynamic-ranksub').setDescription('Rank your subs by XP');
export async function execute(i:any){
  const rels=await prisma.relationship.findMany({ where:{ guildId:i.guildId!, domId:i.user.id, status:'active' } });
  const ids=rels.map(r=>r.subId);
  if(ids.length===0) return i.reply({ content:'You have no active subs.',ephemeral:true});
  const profiles=await prisma.profile.findMany({ where:{ guildId:i.guildId!, userId: { in: ids } }, orderBy:{ xp:'desc' } });
  const lines=profiles.map((p,idx)=>`${idx+1}. <@${p.userId}> — ${p.xp} XP`);
  await i.reply({ content: lines.join('\n') || 'No data.' });
}
