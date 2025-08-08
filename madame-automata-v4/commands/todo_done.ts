import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
import { speak } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('todo_done').setDescription('Mark a task done by ID').addStringOption(o=>o.setName('id').setDescription('Task ID').setRequired(true));
export async function execute(i:any){
  const id=i.options.getString('id',true);
  const t=await prisma.task.update({ where:{ id }, data:{ doneAt:new Date() } }).catch(()=>null);
  if(!t) return i.reply({ embeds:[speak.warn('Not Found','No such task ID.')], ephemeral:true });
  await prisma.profile.updateMany({ where:{ guildId:i.guildId!, userId:t.assignee }, data:{ tasksDone:{ increment:1 } } });
  await i.reply({ embeds:[speak.ok('Task Complete', `Marked **${id}** done.`)] });
}
