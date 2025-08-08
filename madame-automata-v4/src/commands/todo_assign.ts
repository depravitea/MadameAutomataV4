import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('todo_assign').setDescription('Assign a to-do').addUserOption(o=>o.setName('user').setDescription('Assignee').setRequired(true)).addStringOption(o=>o.setName('title').setDescription('Title').setRequired(true));
export async function execute(i:any){ const u=i.options.getUser('user',true); const title=i.options.getString('title',true); await prisma.task.create({ data:{ guildId:i.guildId!, assignee:u.id, assigner:i.user.id, title } }); await i.reply({ content:`Assigned to ${u} — ${title}` }); }
