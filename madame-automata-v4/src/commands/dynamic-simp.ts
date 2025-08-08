import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
import { ensureProfile } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('dynamic-simp').setDescription('Simp for someone publicly').addUserOption(o=>o.setName('target').setDescription('Target').setRequired(true));
export async function execute(i:any){ const t=i.options.getUser('target',true); await ensureProfile(i.guildId!, t.id); await prisma.profile.updateMany({ where:{ guildId:i.guildId!, userId:t.id }, data:{ simpCount: { increment: 1 } } }); await i.reply({ content:`${i.user} simps for ${t}.` }); }
