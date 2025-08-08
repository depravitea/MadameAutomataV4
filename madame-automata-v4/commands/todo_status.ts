import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
import { speak, M } from '../lib/goth.js';
import { toDiscordTs } from '../lib/time.js';
export const data=new SlashCommandBuilder().setName('todo_status')
  .setDescription('See a sub’s task status (open vs done)')
  .addUserOption(o=>o.setName('user').setDescription('Sub').setRequired(true));
export async function execute(i:any){
  const u=i.options.getUser('user',true);
  const open=await prisma.task.findMany({ where:{ guildId:i.guildId!, assignee:u.id, doneAt:null } });
  const done=await prisma.task.findMany({ where:{ guildId:i.guildId!, assignee:u.id, NOT:{ doneAt:null } }, take: 10, orderBy:{ doneAt:'desc' } });
  const openLines=open.map(t=>`• **${t.id}** — ${t.title}${t.dueAt? ' — Due '+toDiscordTs(t.dueAt,'R'):''}`).join('\n')||'—';
  const doneLines=done.map(t=>`• ${t.title} — done ${toDiscordTs(t.doneAt!,'R')}`).join('\n')||'—';
  const fields=[{name:'Open',value:openLines},{name:'Recently Done',value:doneLines}, {name:'Counts', value:`Open: **${open.length}** • Done (last 10): **${done.length}**`, inline:false}];
  await i.reply({ content: M.user(u.id), allowedMentions:{ users:[u.id] }, embeds:[speak.ok('Task Ledger','',fields)] });
}
