import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../lib/db.js';
import { spendGems } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('punish-brand').setDescription('Brand a user (nickname mark)').addUserOption(o=>o.setName('target').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('mark').setDescription('Mark').setRequired(false)).setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames);
export async function execute(i:any){
  const t=i.options.getUser('target',true);
  const mark=i.options.getString('mark')||'❦';
  const ok=await spendGems(i.guildId!, i.user.id, 5);
  if(!ok) return i.reply({ content:'Not enough gems.',ephemeral:true});
  try{
    const m=await i.guild.members.fetch(t.id);
    await m.setNickname(`${mark} ${m.displayName}`);
  }catch{}
  await prisma.punishment.create({ data:{ guildId:i.guildId!, targetId:t.id, kind:'brand', createdBy:i.user.id } });
  await i.reply({ content:`${t} is branded with ${mark}.`});
}
