import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
import { say, M } from '../lib/goth.js';
import { parseInput, toDiscordTs } from '../lib/time.js';
export const data=new SlashCommandBuilder().setName('todo_assign')
  .setDescription('Assign a to-do to a sub with an optional due date/time')
  .addUserOption(o=>o.setName('user').setDescription('Assignee (sub)').setRequired(true))
  .addStringOption(o=>o.setName('title').setDescription('Task title').setRequired(true))
  .addStringOption(o=>o.setName('due').setDescription('Due date/time (YYYY-MM-DD HH:mm)'));
export async function execute(i:any){
  const u=i.options.getUser('user',true);
  const title=i.options.getString('title',true);
  const dueRaw=i.options.getString('due')||'';
  let dueAt: Date | null = null;
  if (dueRaw) {
    const p = parseInput(dueRaw);
    if (!p || !p.isValid()) return say(i,{ title:'Bad Due Date', description:'Use `YYYY-MM-DD HH:mm` in your server timezone or ISO.', ephemeral:true, accent:true });
    dueAt = p.toDate();
  }
  const t=await prisma.task.create({ data:{ guildId:i.guildId!, assignee:u.id, assigner:i.user.id, title, dueAt } });
  await say(i,{ title:'Command Issued', description:`Assigned to ${M.user(u.id)} — ${title}${dueAt? `\n**Due:** ${toDiscordTs(dueAt,'F')}`:''}`, pingUserId: u.id });
}
