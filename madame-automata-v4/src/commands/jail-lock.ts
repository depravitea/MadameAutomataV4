import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('jail-lock').setDescription('Lock someone in jail').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('Reason')).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);
export async function execute(i:any){ const u=i.options.getUser('user',true); const reason=i.options.getString('reason')||'Jailed'; await prisma.jail.create({ data:{ guildId:i.guildId!, userId:u.id, reason } }); await i.reply({ content:`${u} is jailed. Reason: ${reason}`}); }
