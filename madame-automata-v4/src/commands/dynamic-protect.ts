import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('dynamic-protect').setDescription('Protect a submissive').addUserOption(o=>o.setName('sub').setDescription('Submissive').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
export async function execute(i:any){ const sub=i.options.getUser('sub',true); await prisma.consent.upsert({ where:{ id:`${i.guildId}-${sub.id}` }, update:{ limits:'PROTECTED' }, create:{ id:`${i.guildId}-${sub.id}`, guildId:i.guildId!, userId:sub.id, limits:'PROTECTED' } } as any); await i.reply({ content:`${sub} is now protected.` }); }
