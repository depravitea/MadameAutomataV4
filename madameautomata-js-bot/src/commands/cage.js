
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder()
    .setName("cage")
    .setDescription("Lock a submissive in a chastity timer.")
    .addUserOption(o=>o.setName("sub").setDescription("Submissive").setRequired(true))
    .addStringOption(o=>o.setName("time").setDescription("e.g., 1d12h30m").setRequired(true)),
  async run(i) {
    if (!await isDomme(i.member)) return i.reply({ content: "Only Dommes can use this.", ephemeral: true });
    const sub = i.options.getUser("sub", true);
    const time = i.options.getString("time", true);
    let ms;
    try { ms = parseDuration(time); } catch { return i.reply({ content: "Invalid duration. Try 1d12h30m", ephemeral: true }); }
    const ends = new Date(Date.now()+ms);
    await prisma.cage.create({ data: { id: cuid(), subId: sub.id, dommeId: i.user.id, endsAt: ends, active: true } });
    return i.reply({ embeds: [gothicEmbed("Chastity Applied", `**<@${sub.id}>** is now caged until <t:${Math.floor(ends.getTime()/1000)}:f>\n${time} total.`)] });
  }
}


export default cmd;
