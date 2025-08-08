import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('dynamic-unprotect').setDescription('Remove protection').addUserOption(o=>o.setName('sub').setDescription('Submissive').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
export async function execute(i:any){ const sub=i.options.getUser('sub',true); await prisma.consent.deleteMany({ where:{ guildId:i.guildId!, userId: sub.id, limits:'PROTECTED' } }); await i.reply({ content:`${sub} is no longer protected.` }); }
