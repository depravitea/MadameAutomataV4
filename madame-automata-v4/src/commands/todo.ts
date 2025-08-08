import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('todo').setDescription('Personal to-do')
  .addSubcommand(s=>s.setName('add').setDescription('Add').addStringOption(o=>o.setName('title').setDescription('Title').setRequired(true)).addBooleanOption(o=>o.setName('private').setDescription('Private?')))
  .addSubcommand(s=>s.setName('list').setDescription('List'))
  .addSubcommand(s=>s.setName('done').setDescription('Mark done').addStringOption(o=>o.setName('id').setDescription('Task ID').setRequired(true)));
export async function execute(i:any){
  const sub=i.options.getSubcommand();
  if(sub==='add'){
    const title=i.options.getString('title',true);
    const priv=i.options.getBoolean('private')||false;
    const t=await prisma.task.create({ data:{ guildId:i.guildId!, assignee:i.user.id, assigner:i.user.id, title } });
    await i.reply({ content: priv?`(private) Task **${t.id}** — ${title}`:`Task **${t.id}** — ${title}` , ephemeral: priv } as any);
  } else if(sub==='list'){
    const tasks=await prisma.task.findMany({ where:{ guildId:i.guildId!, assignee:i.user.id, doneAt:null } });
    const lines=tasks.map(t=>`• **${t.id}** — ${t.title}`);
    await i.reply({ content: lines.join('\n') || 'No open to-dos.' });
  } else if(sub==='done'){
    const id=i.options.getString('id',true);
    await prisma.task.update({ where:{ id }, data:{ doneAt:new Date() } }).catch(()=>null);
    await i.reply({ content:`Marked **${id}** done.` });
  }
}
