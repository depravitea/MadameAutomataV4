
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder()
    .setName("taskcomplete")
    .setDescription("Submit a task for approval.")
    .addStringOption(o=>o.setName("taskid").setDescription("Task ID").setRequired(true)),
  async run(i) {
    const taskid = i.options.getString("taskid", true);
    const t = await prisma.task.findUnique({ where: { id: taskid } });
    if (!t) return i.reply({ content: "Task not found.", ephemeral: true });
    if (t.assigneeId !== i.user.id) return i.reply({ content: "This isn't your task.", ephemeral: true });
    await prisma.task.update({ where: { id: taskid }, data: { completed: true } });

    const approve = new ButtonBuilder().setCustomId(`approve:${taskid}`).setStyle(ButtonStyle.Success).setLabel("Approve ✅");
    const revise  = new ButtonBuilder().setCustomId(`revise:${taskid}`).setStyle(ButtonStyle.Secondary).setLabel("Request Revision ✎");
    const row = new ActionRowBuilder().addComponents(approve, revise);
    return i.reply({ embeds: [gothicEmbed("Task Submitted", `Task **${t.title}** submitted for approval by <@${t.ownerId}>.`)], components: [row] });
  }
}


export default cmd;
