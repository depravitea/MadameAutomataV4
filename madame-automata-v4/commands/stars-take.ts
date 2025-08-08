import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../lib/db.js';
import { say, M } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('stars-take').setDescription('Remove gold star(s) from a sub, with reason')
  .addUserOption(o=>o.setName('sub').setDescription('Sub').setRequired(true))
  .addIntegerOption(o=>o.setName('amount').setDescription('Number of stars').setRequired(true))
  .addStringOption(o=>o.setName('reason').setDescription('Reason').setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
export async function execute(i:any){
  const sub=i.options.getUser('sub',true);
  const amt=Math.abs(i.options.getInteger('amount',true));
  const reason=i.options.getString('reason',true);
  await prisma.goldStar.create({ data:{ guildId:i.guildId!, domId:i.user.id, subId:sub.id, delta: -amt, reason } });
  await prisma.profile.updateMany({ where:{ guildId:i.guildId!, userId:sub.id }, data:{ starCount:{ decrement: amt } } });
  await say(i,{ title:'Gold Star Removed', description:`${M.user(sub.id)} −**${amt}** ⭐ — ${reason}`, pingUserId: sub.id, accent:true });
}
