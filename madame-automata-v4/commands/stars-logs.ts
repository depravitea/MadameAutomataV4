import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
import { speak, M } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('stars-logs').setDescription('See star removals/additions for a sub')
  .addUserOption(o=>o.setName('sub').setDescription('Sub').setRequired(true));
export async function execute(i:any){
  const sub=i.options.getUser('sub',true);
  const logs=await prisma.goldStar.findMany({ where:{ guildId:i.guildId!, subId:sub.id }, orderBy:{ createdAt:'desc' }, take: 10 });
  const lines=logs.map(l=>`• ${l.delta>0?'+':''}${l.delta} ⭐ — ${l.reason||'—'} — <t:${Math.floor(new Date(l.createdAt).getTime()/1000)}:R>`).join('\n')||'—';
  await i.reply({ content: M.user(sub.id), allowedMentions:{ users:[sub.id] }, embeds:[speak.ok('Star Ledger', lines)] });
}
