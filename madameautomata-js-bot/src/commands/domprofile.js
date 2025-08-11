
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder()
    .setName("domprofile")
    .setDescription("Show or set a Domme profile.")
    .addStringOption(o=>o.setName("titles").setDescription("Preferred titles"))
    .addStringOption(o=>o.setName("about").setDescription("About me"))
    .addStringOption(o=>o.setName("limits").setDescription("Limits"))
    .addUserOption(o=>o.setName("user").setDescription("View another Domme")),
  async run(i) {
    const titles = i.options.getString("titles");
    const about = i.options.getString("about");
    const limits = i.options.getString("limits");
    const target = i.options.getUser("user") ?? i.user;
    if (target.id === i.user.id && (titles!==null || about!==null || limits!==null)) {
      await prisma.user.upsert({
        where: { id: i.user.id },
        update: { isDomme: true, ...(titles!==null?{titles}:{}) , ...(about!==null?{about}:{}) , ...(limits!==null?{limits}:{}) },
        create: { id: i.user.id, isDomme: true, titles, about, limits }
      });
      return i.reply({ content: "Profile updated.", ephemeral: true });
    }
    const tu = await prisma.user.findUnique({ where: { id: target.id } });
    const collared = await prisma.collaring.count({ where: { dommeId: target.id, active: true } });
    const e = gothicEmbed("👑 Domme Profile",
      `**User:** <@${target.id}>\n**Titles:** ${tu?.titles ?? "—"}\n**About:** ${tu?.about ?? "—"}\n**Limits:** ${tu?.limits ?? "—"}\n**Currently collared:** ${collared}`
    );
    return i.reply({ embeds: [e] });
  }
}


export default cmd;
