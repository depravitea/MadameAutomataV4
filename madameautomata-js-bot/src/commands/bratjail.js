
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder()
    .setName("bratjail")
    .setDescription("Harsher jail; mistakes add to total and case re-randomizes.")
    .addUserOption(o=>o.setName("sub").setDescription("Submissive").setRequired(true))
    .addStringOption(o=>o.setName("sentence").setDescription("Sentence to type").setRequired(true))
    .addIntegerOption(o=>o.setName("times").setDescription("How many times").setRequired(true)),
  async run(i) {
    if (!await isDomme(i.member)) return i.reply({ content: "Only Dommes can use this.", ephemeral: true });
    const sub = i.options.getUser("sub", true);
    const sentence = i.options.getString("sentence", true);
    const times = i.options.getInteger("times", true);
    const seed = Math.floor(Math.random()*1e9);
    await prisma.jailSession.create({ data: { id: cuid(), subId: sub.id, dommeId: i.user.id, brat: true, sentenceText: sentence, totalNeeded: times, caseSeed: seed, active: true } });
    return i.reply({ embeds: [gothicEmbed("Brat Jail", `**<@${sub.id}>** must type this exactly **${times}** times. Mistakes add +1 and re-randomize.`)] });
  }
}


export default cmd;
