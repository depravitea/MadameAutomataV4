
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder()
    .setName("release")
    .setDescription("Release a user from collar, chastity, or jail.")
    .addUserOption(o=>o.setName("user").setDescription("Target").setRequired(true))
    .addStringOption(o=>o.setName("what").setDescription("What to release").setRequired(true).addChoices(
      { name: "Collar", value: "collar" },
      { name: "Chastity", value: "chastity" },
      { name: "Jail", value: "jail" },
      { name: "Brat Jail", value: "bratjail" }
    )),
  async run(i) {
    if (!await isDomme(i.member)) return i.reply({ content: "Only Dommes can use this.", ephemeral: true });
    const user = i.options.getUser("user", true);
    const what = i.options.getString("what", true);
    if (what === "collar") {
      const active = await prisma.collaring.findFirst({ where: { subId: user.id, dommeId: i.user.id, active: true } });
      if (!active) return i.reply({ content: "You don't have an active collar on this sub.", ephemeral: true });
      await prisma.collaring.update({ where: { id: active.id }, data: { active: false, endedAt: new Date() } });
      await prisma.user.update({ where: { id: user.id }, data: { dommeReleases: { increment: 1 } } }).catch(()=>{});
      return i.reply({ embeds: [gothicEmbed("Collar Released", `Released <@${user.id}>.`)] });
    }
    if (what === "chastity") {
      await prisma.cage.updateMany({ where: { subId: user.id, dommeId: i.user.id, active: true }, data: { active: false } });
      return i.reply({ embeds: [gothicEmbed("Chastity Released", `Released <@${user.id}> from chastity.`)] });
    }
    if (what === "jail" || what === "bratjail") {
      await prisma.jailSession.updateMany({ where: { subId: user.id, active: true }, data: { active: false } });
      return i.reply({ embeds: [gothicEmbed("Jail Released", `Released <@${user.id}> from jail.`)] });
    }
  }
}


export default cmd;
