
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder().setName("caged").setDescription("Show all currently caged submissives."),
  async run(i) {
    const rows = await prisma.cage.findMany({ where: { active: true } });
    if (!rows.length) return i.reply({ content: "No one is currently caged.", ephemeral: true });
    const lines = rows.map(r=>`• <@${r.subId}> until <t:${Math.floor(new Date(r.endsAt).getTime()/1000)}:R>`).join("\n");
    return i.reply({ embeds: [gothicEmbed("Currently Caged", lines)] });
  }
}


export default cmd;
