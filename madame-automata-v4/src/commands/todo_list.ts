import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('todo_list').setDescription('List your to-dos');
export async function execute(i:any){ const tasks=await prisma.task.findMany({ where:{ guildId:i.guildId!, assignee:i.user.id, doneAt:null } }); const lines=tasks.map(t=>`• **${t.id}** — ${t.title}`); await i.reply({ content: lines.join('\n') || 'No open to-dos.' }); }
