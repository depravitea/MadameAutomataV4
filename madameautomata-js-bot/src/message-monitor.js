
import { prisma } from "./lib/prisma.js";
import { randomCase } from "./util/duration.js";
import { gothicEmbed } from "./theme/theme.js";

export async function onMessage(message) {
  if (message.author.bot || !message.guild) return;
  const sessions = await prisma.jailSession.findMany({ where: { subId: message.author.id, active: true } });
  if (!sessions.length) return;
  for (const s of sessions) {
    const expected = randomCase(s.sentenceText, s.brat ? Math.floor(Math.random()*1e9) : s.caseSeed);
    if (message.content.trim() === expected) {
      const updated = await prisma.jailSession.update({ where: { id: s.id }, data: { completed: { increment: 1 } } });
      if (updated.completed + 1 >= s.totalNeeded) {
        await prisma.jailSession.update({ where: { id: s.id }, data: { active: false } });
        await message.reply({ embeds: [gothicEmbed("Jail Complete", "Sentence satisfied.")] });
      } else {
        try { await message.react("🦇"); } catch {}
      }
    } else if (s.brat) {
      await prisma.jailSession.update({ where: { id: s.id }, data: { mistakes: { increment: 1 }, totalNeeded: { increment: 1 } } });
      await message.channel.send({ content: "Mistake detected. Total increased by 1." });
    }
  }
}
