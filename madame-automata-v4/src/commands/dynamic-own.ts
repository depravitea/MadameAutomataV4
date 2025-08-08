import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'; import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('dynamic-own').setDescription('Claim ownership of a consenting sub').addUserOption(o=>o.setName('sub').setDescription('Submissive').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
export async function execute(i){ const dom=i.user; const sub=i.options.getUser('sub',true);
  await prisma.user.upsert({ where:{id:dom.id}, update:{}, create:{id:dom.id,guildId:i.guildId!,isDom:true} });
  await prisma.user.upsert({ where:{id:sub.id}, update:{}, create:{id:sub.id,guildId:i.guildId!,isDom:false} });
  await prisma.relationship.create({ data:{ guildId:i.guildId!, domId:dom.id, subId:sub.id, status:'active' } });
  await i.reply({ content:`A vow is spoken in shadow. ${dom} now owns ${sub}.` });
}
