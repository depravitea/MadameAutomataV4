import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder
} from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = {
  data: new SlashCommandBuilder()
    .setName("task")
    .setDescription("Assign a task to a sub or blast to @taskslut (leave sub empty).")
    // REQUIRED FIRST
    .addStringOption(o =>
      o.setName("title").setDescription("Title").setRequired(true)
    )
    // THEN OPTIONALS
    .addUserOption(o =>
      o.setName("sub").setDescription("Assignee (leave empty for role blast)")
    )
    .addStringOption(o =>
      o.setName("details").setDescription("Details / checklist")
    )
    .addStringOption(o =>
      o.setName("deadline").setDescription("Relative time like 12h or 2d")
    ),

  async run(i) {
    if (!await isDomme(i.member)) {
      return i.reply({ content: "Only Dommes can use this.", ephemeral: true });
    }

    const sub = i.options.getUser("sub");
    const title = i.options.getString("title", true);
    const details = i.options.getString("details") || null;
    const deadline = i.options.getString("deadline");

    let dueAt = null;
    if (deadline) {
      const m = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?$/i.exec(deadline.trim());
      if (m) {
        const d = Number(m[1] || 0), h = Number(m[2] || 0), mi = Number(m[3] || 0);
        const secs = (((d * 24 + h) * 60) + mi) * 60;
        if (secs > 0) dueAt = new Date(Date.now() + secs * 1000);
      }
    }

    // Single sub path
    if (sub) {
      const t = await prisma.task.create({
        data: { id: cuid(), ownerId: i.user.id, assigneeId: sub.id, title, details, dueAt }
      });

      const accept = new ButtonBuilder()
        .setCustomId(`accept:${t.id}`)
        .setStyle(ButtonStyle.Success)
        .setLabel("Accept Task");
      const row = new ActionRowBuilder().addComponents(accept);

      const body = `${title}\n${details || ""}${dueAt ? `\nDue: <t:${Math.floor(dueAt.getTime() / 1000)}:R>` : ""}`;

      try {
        const dm = await sub.createDM();
        await dm.send({ embeds: [gothicEmbed("Task Assigned", `**<@${sub.id}>** ${body}`)], components: [row] });
        return i.reply({ embeds: [gothicEmbed("Task Assigned", `Sent to <@${sub.id}> via DM.`)], ephemeral: true });
      } catch {
        return i.reply({ embeds: [gothicEmbed("Task Assigned", `**<@${sub.id}>** ${body}`)], components: [row] });
      }
    }

    // Role blast
    const cfg = await getConfig();
    if (!cfg.taskSlutRoleId) {
      return i.reply({ content: "No TaskSlut role set. Use /setup.", ephemeral: true });
    }
    const role = i.guild.roles.cache.get(cfg.taskSlutRoleId);
    if (!role) {
      return i.reply({ content: "Configured TaskSlut role not found on this server.", ephemeral: true });
    }

    const members = role.members.filter(m => !m.user.bot);
    let sent = 0;

    for (const m of members.values()) {
      const t = await prisma.task.create({
        data: { id: cuid(), ownerId: i.user.id, assigneeId: m.id, title, details, dueAt }
      });

      const accept = new ButtonBuilder()
        .setCustomId(`accept:${t.id}`)
        .setStyle(ButtonStyle.Success)
        .setLabel("Accept Task");
      const row = new ActionRowBuilder().addComponents(accept);

      const body = `${title}\n${details || ""}${dueAt ? `\nDue: <t:${Math.floor(dueAt.getTime() / 1000)}:R>` : ""}`;

      try {
        const dm = await m.createDM();
        await dm.send({ embeds: [gothicEmbed("Task Assigned", `**<@${m.id}>** ${body}`)], components: [row] });
        sent++;
      } catch {
        // ignore DM failures; they can accept from channel summary if you post it
      }
    }

    return i.reply({
      embeds: [gothicEmbed("Task Blast", `Assigned **${members.size}** tasks to <@&${role.id}>. DMs sent to **${sent}**.`)]
    });
  }
};

export default cmd;
