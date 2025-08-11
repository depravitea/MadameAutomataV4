
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder()
    .setName("punish")
    .setDescription("Issue a punishment to a sub.")
    .addUserOption(o=>o.setName("sub").setDescription("Submissive").setRequired(true))
    .addStringOption(o=>o.setName("reason").setDescription("Punishment details").setRequired(true)),
  async run(i) {
    if (!await isDomme(i.member)) return i.reply({ content: "Only Dommes can use this.", ephemeral: true });
    const sub = i.options.getUser("sub", true);
    const reason = i.options.getString("reason", true);
    return i.reply({ embeds: [gothicEmbed("Punishment", `**<@${sub.id}>** You are punished: ${reason}`)] });
  }
}


export default cmd;
