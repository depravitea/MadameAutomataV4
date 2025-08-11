
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder()
    .setName("worship")
    .setDescription("Offer worship to the Worship Me role or a Domme.")
    .addUserOption(o=>o.setName("domme").setDescription("Domme to worship"))
    .addStringOption(o=>o.setName("text").setDescription("Your worship text").setRequired(true)),
  async run(i) {
    const domme = i.options.getUser("domme");
    const text = i.options.getString("text", true);
    await prisma.worship.create({ data: { id: cuid(), subId: i.user.id, dommeId: domme?.id || null, content: text } });
    const cfg = await getConfig();
    const e = gothicEmbed("Worship", `**<@${i.user.id}>** whispers:\n> ${text}\n\n${domme?`For <@${domme.id}>`:""}`);
    const ch = cfg.worshipChannelId ? i.guild.channels.cache.get(cfg.worshipChannelId) : null;
    if (ch?.isTextBased?.()) { await ch.send({ embeds: [e] }); return i.reply({ content: "Offered.", ephemeral: true }); }
    return i.reply({ embeds: [e] });
  }
}


export default cmd;
