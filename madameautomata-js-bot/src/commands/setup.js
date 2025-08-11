
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Configure role and channel IDs (admin only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(s => s.setName("set-role")
      .setDescription("Set a role mapping")
      .addStringOption(o => o.setName("key").setDescription("Which role").setRequired(true).addChoices(
        { name: "Domme", value: "dommeRoleId" },
        { name: "Sub", value: "subRoleId" },
        { name: "TaskSlut", value: "taskSlutRoleId" },
        { name: "WorshipMe", value: "worshipMeRoleId" },
        { name: "Staff", value: "staffRoleId" }
      ))
      .addRoleOption(o => o.setName("role").setDescription("Role").setRequired(true)))
    .addSubcommand(s => s.setName("set-channel")
      .setDescription("Set a channel mapping")
      .addStringOption(o => o.setName("key").setDescription("Which channel").setRequired(true).addChoices(
        { name: "Jail", value: "jailChannelId" },
        { name: "BratJail", value: "bratJailChannelId" },
        { name: "Worship", value: "worshipChannelId" },
        { name: "StaffAlerts", value: "staffAlertsChannelId" }
      ))
      .addChannelOption(o => o.setName("channel").setDescription("Channel").addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement).setRequired(true)))
    .addSubcommand(s => s.setName("show").setDescription("Show current config")),
  async run(i) {
    const sub = i.options.getSubcommand();
    if (sub === "set-role") {
      const key = i.options.getString("key", true);
      const role = i.options.getRole("role", true);
      await prisma.config.upsert({ where: { id: 1 }, update: { [key]: role.id }, create: { id: 1, [key]: role.id } });
      return i.reply({ embeds: [gothicEmbed("Setup", `Saved **${key}** → <@&${role.id}>`)], ephemeral: true });
    }
    if (sub === "set-channel") {
      const key = i.options.getString("key", true);
      const ch = i.options.getChannel("channel", true);
      await prisma.config.upsert({ where: { id: 1 }, update: { [key]: ch.id }, create: { id: 1, [key]: ch.id } });
      return i.reply({ embeds: [gothicEmbed("Setup", `Saved **${key}** → <#${ch.id}>`)], ephemeral: true });
    }
    const cfg = await getConfig();
    const lines = Object.entries(cfg).map(([k,v]) => `• **${k}**: ${v ?? "—"}`).join("\n");
    return i.reply({ embeds: [gothicEmbed("Current Config", lines)], ephemeral: true });
  }
}


export default cmd;
