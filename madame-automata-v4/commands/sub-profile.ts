import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
import { speak, M } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('sub-profile').setDescription('See a sub’s standing & history')
  .addUserOption(o=>o.setName('user').setDescription('Sub').setRequired(true));
export async function execute(i:any){
  const u=i.options.getUser('user',true);
  const p=await prisma.profile.findFirst({ where:{ guildId:i.guildId!, userId:u.id } });
  const owned=await prisma.relationship.findFirst({ where:{ guildId:i.guildId!, subId:u.id, status:'active' } });
  const protectedBy=await prisma.consent.findFirst({ where:{ guildId:i.guildId!, userId:u.id, limits:'PROTECTED' } });
  const consider=await prisma.relationship.findFirst({ where:{ guildId:i.guildId!, subId:u.id, status:'consider' } });
  const fields=[
    { name:'Collared By', value: owned? `<@${owned.domId}>` : '—', inline:true },
    { name:'Protected By', value: protectedBy? 'Yes' : '—', inline:true },
    { name:'Under Consideration', value: consider? 'Yes' : '—', inline:true },
    { name:'Praise', value: String(p?.praiseCount||0), inline:true },
    { name:'Jailed Times', value: String(p?.jailedCount||0), inline:true },
    { name:'Tasks Completed', value: String(p?.tasksDone||0), inline:true },
    { name:'Dynamics Ended', value: String(p?.dynamicsEnded||0), inline:true },
    { name:'Gold Stars', value: String(p?.starCount||0), inline:true },
  ];
  await i.reply({ content: M.user(u.id), allowedMentions:{ users:[u.id] }, embeds:[speak.ok('Sub Ledger','',fields)] });
}
