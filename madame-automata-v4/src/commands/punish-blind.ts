import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('punish-blind').setDescription('Blindfold a user (toggle role)').addUserOption(o=>o.setName('target').setDescription('User').setRequired(true)).addBooleanOption(o=>o.setName('on').setDescription('On?').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
export async function execute(i:any){
  const t=i.options.getUser('target',true);
  const on=i.options.getBoolean('on',true);
  const g=await prisma.guild.findUnique({ where:{ id:i.guildId! } });
  const roleId=g?.blindfoldRole||process.env.BLINDFOLD_ROLE_ID;
  if(!roleId) return i.reply({ content:'Set blindfoldRole via /config first.',ephemeral:true});
  const m=await i.guild.members.fetch(t.id);
  if(on) await m.roles.add(roleId).catch(()=>{}); else await m.roles.remove(roleId).catch(()=>{});
  await i.reply({ content:`${t} is ${on ? 'blindfolded' : 'unblindfolded'}.`});
}
