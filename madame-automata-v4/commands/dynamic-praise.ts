import { SlashCommandBuilder } from 'discord.js';
import { addXP } from '../lib/economy.js';
import { say, M } from '../lib/goth.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('dynamic-praise')
  .setDescription('Praise a submissive with a custom note')
  .addUserOption(o=>o.setName('sub').setDescription('Submissive').setRequired(true))
  .addStringOption(o=>o.setName('note').setDescription('Your praise').setRequired(true));
export async function execute(i:any){
  const sub=i.options.getUser('sub',true);
  const note=i.options.getString('note',true);
  await addXP(i.guildId!, sub.id, 5);
  await prisma.praise.create({ data:{ guildId:i.guildId!, domId:i.user.id, subId:sub.id, note } });
  await prisma.profile.updateMany({ where:{ guildId:i.guildId!, userId:sub.id }, data:{ praiseCount:{ increment:1 } } });
  await say(i,{ title:'Praise', description:`${M.user(sub.id)} — ${note}`, pingUserId: sub.id, accent:true });
}
