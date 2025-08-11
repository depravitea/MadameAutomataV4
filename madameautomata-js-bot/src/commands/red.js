
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder().setName("red").setDescription("Emergency release and alert staff."),
  async run(i) {
    await prisma.jailSession.updateMany({ where: { subId: i.user.id, active: true }, data: { active: false } });
    await prisma.cage.updateMany({ where: { subId: i.user.id, active: true }, data: { active: false } });
    const cfg = await getConfig();
    if (cfg.staffAlertsChannelId) {
      const ch = i.guild.channels.cache.get(cfg.staffAlertsChannelId);
      if (ch && ch.isTextBased()) ch.send({ embeds: [gothicEmbed("RED ALERT", `Attention staff: <@${i.user.id}> called RED.`)] });
    }
    return i.reply({ embeds: [gothicEmbed("RED", `<@${i.user.id}> has called RED. Staff alerted; all punishments paused.`)], ephemeral: true });
  }
}


export default cmd;
