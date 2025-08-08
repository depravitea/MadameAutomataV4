import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
import { say, M } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('dynamic-worship')
  .setDescription('Write worship for a Domme (min 500 chars)')
  .addUserOption(o=>o.setName('dom').setDescription('Domme').setRequired(true))
  .addStringOption(o=>o.setName('text').setDescription('Your worship (500+ chars)').setRequired(true));
export async function execute(i:any){
  const dom=i.options.getUser('dom',true);
  const text=i.options.getString('text',true);
  if (text.replace(/\s+/g,' ').trim().length < 500)
    return say(i,{ title:'Too Short', description:'Worship must be at least **500** characters.', ephemeral:true, accent:true });
  await prisma.worship.create({ data:{ guildId:i.guildId!, domId:dom.id, subId:i.user.id, text } });
  await prisma.profile.updateMany({ where:{ guildId:i.guildId!, userId:dom.id }, data:{ worshipCount:{ increment:1 } } });
  await say(i,{ title:'Devotion Recorded', description:`${M.user(i.user.id)} worships ${M.user(dom.id)}.`, pingUserId: dom.id });
}
