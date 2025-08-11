
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder()
    .setName("star")
    .setDescription("Give/take stars for subs, or view inventory")
    .addStringOption(o=>o.setName("action").setDescription("give/take/inventory").setRequired(true).addChoices(
      { name: "give", value: "give" },
      { name: "take", value: "take" },
      { name: "inventory", value: "inventory" }
    ))
    .addUserOption(o=>o.setName("sub").setDescription("Submissive"))
    .addStringOption(o=>o.setName("reason").setDescription("Reason")),
  async run(i) {
    const action = i.options.getString("action", true);
    if (action === "inventory") {
      const u = await prisma.user.findUnique({ where: { id: i.user.id } });
      const xp = u?.dommeXp || 0;
      const given = (await prisma.star.aggregate({ _sum: { amount: true }, where: { dommeId: i.user.id, amount: { gt: 0 } } }))._sum.amount || 0;
      const taken = (await prisma.star.aggregate({ _sum: { amount: true }, where: { dommeId: i.user.id, amount: { lt: 0 }, status: "APPROVED" } }))._sum.amount || 0;
      const stars = Math.floor(xp/50) - (given + taken);
      return i.reply({ embeds: [gothicEmbed("Star Inventory", `You can give **${stars}** stars.`)], ephemeral: true });
    }
    if (!await isDomme(i.member)) return i.reply({ content: "Only Dommes can use this.", ephemeral: true });
    const sub = i.options.getUser("sub");
    if (!sub) return i.reply({ content: "Pick a sub.", ephemeral: true });
    const reason = i.options.getString("reason") || null;
    if (action === "give") {
      const u = await prisma.user.findUnique({ where: { id: i.user.id } });
      const xp = u?.dommeXp || 0;
      const given = (await prisma.star.aggregate({ _sum: { amount: true }, where: { dommeId: i.user.id, amount: { gt: 0 } } }))._sum.amount || 0;
      const taken = (await prisma.star.aggregate({ _sum: { amount: true }, where: { dommeId: i.user.id, amount: { lt: 0 }, status: "APPROVED" } }))._sum.amount || 0;
      const stars = Math.floor(xp/50) - (given + taken);
      if (stars <= 0) return i.reply({ content: "You have no stars left to give.", ephemeral: true });
      await prisma.star.create({ data: { id: cuid(), dommeId: i.user.id, subId: sub.id, amount: 1, reason, status: "APPROVED" } });
      return i.reply({ embeds: [gothicEmbed("Star Given", `You gave a ⭐ to <@${sub.id}>.`)] });
    } else {
      await prisma.star.create({ data: { id: cuid(), dommeId: i.user.id, subId: sub.id, amount: -1, reason, status: "PENDING" } });
      return i.reply({ embeds: [gothicEmbed("Star Removal Requested", `Removal request for <@${sub.id}> sent to staff.`)] });
    }
  }
}


export default cmd;
