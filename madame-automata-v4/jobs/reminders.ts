import { prisma } from '../lib/db.js';
import { Client, TextChannel } from 'discord.js';

const WARN_MINUTES = parseInt(process.env.REMINDER_WARN_MINUTES||'30',10);
const CHECK_MS = parseInt(process.env.REMINDER_CHECK_MS||'60000',10);

export function startReminders(client: Client){
  setInterval(async ()=>{
    const now = new Date();
    const soon = new Date(now.getTime() + WARN_MINUTES*60*1000);

    const toWarn = await prisma.task.findMany({ where:{
      dueAt: { lte: soon, gte: now },
      warnedAt: null,
      doneAt: null
    } });
    for (const t of toWarn){
      try {
        const guild = await client.guilds.fetch(t.guildId);
        const channels = (await guild.channels.fetch()).filter(c=>c?.isTextBased());
        const any = channels.find(c=>c?.isTextBased());
        if (any) {
          const ch = any as TextChannel;
          await ch.send({ content: `<@${t.assignee}>`, allowedMentions:{ users:[t.assignee] }, embeds:[{ title:'༺ ❦ Task Due Soon ❦ ༻', description:`**${t.title}** is due soon.` }] as any });
        }
      } catch {}
      await prisma.task.update({ where:{ id:t.id }, data:{ warnedAt: new Date() } });
    }

    const overdue = await prisma.task.findMany({ where:{
      dueAt: { lt: now },
      doneAt: null
    } });
    for (const t of overdue){
      try {
        const guild = await client.guilds.fetch(t.guildId);
        const channels = (await guild.channels.fetch()).filter(c=>c?.isTextBased());
        const any = channels.find(c=>c?.isTextBased());
        if (any) {
          const ch = any as TextChannel;
          await ch.send({ content: `<@${t.assignee}>`, allowedMentions:{ users:[t.assignee] }, embeds:[{ title:'༺ ❦ Task Overdue ❦ ༻', description:`**${t.title}** is overdue.` }] as any });
        }
      } catch {}
    }

  }, CHECK_MS);
}
