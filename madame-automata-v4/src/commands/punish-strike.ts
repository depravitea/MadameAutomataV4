import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('punish-strike').setDescription('Record a strike against a user').addUserOption(o=>o.setName('target').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('Reason')).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);
export async function execute(i:any){ const t=i.options.getUser('target',true); const reason=i.options.getString('reason')||'strike'; await prisma.punishment.create({ data:{ guildId:i.guildId!, targetId:t.id, kind:'strike', reason, createdBy:i.user.id } }); await i.reply({ content:`Strike recorded for ${t} — ${reason}`}); }
