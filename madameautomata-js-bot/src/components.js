
import { prisma } from "./lib/prisma.js";
import { gothicEmbed } from "./theme/theme.js";

export async function handleComponent(interaction) {
  const id = interaction.customId || "";
  if (id.startsWith("accept:")) {
    const taskId = id.split(":")[1];
    const t = await prisma.task.findUnique({ where: { id: taskId } });
    if (!t) return interaction.reply({ content: "Task not found.", ephemeral: true });
    if (interaction.user.id !== t.assigneeId) return interaction.reply({ content: "Only the assignee can accept.", ephemeral: true });
    await prisma.task.update({ where: { id: taskId }, data: { accepted: true } });
    return interaction.update({ embeds: [gothicEmbed("Task Accepted", `Task **${t.title}** accepted by <@${t.assigneeId}>.`)], components: [] });
  }
  if (id.startsWith("approve:")) {
    const taskId = id.split(":")[1];
    const t = await prisma.task.findUnique({ where: { id: taskId } });
    if (!t) return interaction.reply({ content: "Task not found.", ephemeral: true });
    if (interaction.user.id !== t.ownerId) return interaction.reply({ content: "Only the assigning Domme can approve.", ephemeral: true });
    await prisma.task.update({ where: { id: taskId }, data: { approved: true } });
    return interaction.update({ embeds: [gothicEmbed("Task Approved", `Task **${t.title}** approved.`)], components: [] });
  }
  if (id.startsWith("revise:")) {
    const taskId = id.split(":")[1];
    const t = await prisma.task.findUnique({ where: { id: taskId } });
    if (!t) return interaction.reply({ content: "Task not found.", ephemeral: true });
    if (interaction.user.id !== t.ownerId) return interaction.reply({ content: "Only the assigning Domme can request revision.", ephemeral: true });
    await prisma.task.update({ where: { id: taskId }, data: { completed: false, approved: null } });
    return interaction.update({ embeds: [gothicEmbed("Revision Requested", `Task **${t.title}** needs revision.`)], components: [] });
  }
}
