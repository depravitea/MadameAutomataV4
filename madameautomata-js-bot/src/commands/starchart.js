
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder().setName("starchart").setDescription("All-time starchart"),
  async run(i) {
    const rows = await prisma.star.groupBy({
      by: ["subId"],
      _sum: { amount: true },
      where: { status: "APPROVED" },
      orderBy: { _sum: { amount: "desc" } },
      take: 10
    });
    if (!rows.length) return i.reply({ embeds: [gothicEmbed("All-Time Starchart", "—")] });
    const lines = rows.map((r,idx)=>`**${idx+1}.** <@${r.subId}> — ${r._sum.amount} ⭐`).join("\n");
    return i.reply({ embeds: [gothicEmbed("All-Time Starchart", lines)] });
  }
}


export default cmd;
