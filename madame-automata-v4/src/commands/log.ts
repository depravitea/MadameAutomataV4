import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('log').setDescription('Create a log entry').addStringOption(o=>o.setName('content').setDescription('Entry').setRequired(true)).addBooleanOption(o=>o.setName('private').setDescription('Private?'));
export async function execute(i:any){ const content=i.options.getString('content',true); const priv=i.options.getBoolean('private')||false; await prisma.logEntry.create({ data:{ guildId:i.guildId!, userId:i.user.id, content, private: priv } }); await i.reply({ content: priv ? 'Private log stored.' : 'Log stored.' , ephemeral:priv } as any); }
