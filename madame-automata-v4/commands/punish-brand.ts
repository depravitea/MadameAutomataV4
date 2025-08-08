import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../lib/db.js';
import { spendGems } from '../lib/economy.js';
import { say, M } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('punish-brand')
  .setDescription('Brand a user (nickname mark) (with a written reason)')
  .addUserOption(o=>o.setName('target').setDescription('User').setRequired(true))
  .addStringOption(o=>o.setName('reason').setDescription('Reason / note').setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);
export async function execute(i:any){
  const t=i.options.getUser('target',true);

  const reason=i.options.getString('reason',true);
  const ok=await spendGems(i.guildId!, i.user.id, 5).catch(()=>true);
  if(!ok) return say(i,{ title:'Empty Coffers', description:'Your purse is dust. Earn more 💎 first.', ephemeral:true, accent:true });
  await prisma.punishment.create({ data:{ guildId:i.guildId!, targetId:t.id, kind:'brand', reason, createdBy:i.user.id } });
  await say(i,{ title:'Punishment', description:`${M.user(t.id)} — ${reason}`, pingUserId: t.id, accent:true });
}
