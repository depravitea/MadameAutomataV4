import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { say, M } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('punish-bondage')
  .setDescription('Apply a restrictive role with a written reason')
  .addUserOption(o=>o.setName('target').setDescription('User').setRequired(true))
  .addRoleOption(o=>o.setName('role').setDescription('Restrictive role').setRequired(true))
  .addStringOption(o=>o.setName('reason').setDescription('Reason / note').setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
export async function execute(i:any){
  const t=i.options.getUser('target',true);
  const role=i.options.getRole('role',true) as any;
  const reason=i.options.getString('reason',true);
  const m=await i.guild.members.fetch(t.id);
  await m.roles.add(role.id).catch(()=>{});
  await say(i,{ title:'Bondage', description:`${M.user(t.id)} — ${reason} (role: ${role})`, pingUserId: t.id, accent:true });
}
