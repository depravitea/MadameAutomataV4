import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../lib/db.js';
import { spendGems } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('punish-censor').setDescription('Censor a user (bot ignores them)').addUserOption(o=>o.setName('target').setDescription('User').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);
export async function execute(i:any){ const t=i.options.getUser('target',true); const ok=await spendGems(i.guildId!, i.user.id, 5); if(!ok) return i.reply({ content:'Not enough gems.',ephemeral:true}); await prisma.punishment.create({ data:{ guildId:i.guildId!, targetId:t.id, kind:'censor', createdBy:i.user.id } }); await i.reply({ content:`${t} is censored from bot interactions.`}); }
