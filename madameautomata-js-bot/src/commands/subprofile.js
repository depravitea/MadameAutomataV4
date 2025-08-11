
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder()
    .setName("subprofile")
    .setDescription("Show or set a Sub profile.")
    .addStringOption(o=>o.setName("petnames").setDescription("Preferred pet names"))
    .addStringOption(o=>o.setName("about").setDescription("About me"))
    .addStringOption(o=>o.setName("limits").setDescription("Limits"))
    .addUserOption(o=>o.setName("user").setDescription("View another Sub")),
  async run(i) {
    const pet = i.options.getString("petnames");
    const about = i.options.getString("about");
    const limits = i.options.getString("limits");
    const target = i.options.getUser("user") ?? i.user;
    if (target.id === i.user.id && (pet!==null || about!==null || limits!==null)) {
      await prisma.user.upsert({
        where: { id: i.user.id },
        update: { isSub: true, ...(pet!==null?{titles: pet}:{}) , ...(about!==null?{about}:{}) , ...(limits!==null?{limits}:{}) },
        create: { id: i.user.id, isSub: true, titles: pet, about, limits }
      });
      return i.reply({ content: "Profile updated.", ephemeral: true });
    }
    const tu = await prisma.user.findUnique({ where: { id: target.id } });
    const collars = await prisma.collaring.findMany({ where: { subId: target.id, active: true } });
    const collines = collars.length ? collars.map(c=>`${c.type} by <@${c.dommeId}>`).join("\n") : "—";
    const done = await prisma.task.count({ where: { assigneeId: target.id, approved: true } });
    const e = gothicEmbed("🩸 Sub Profile",
      `**User:** <@${target.id}>\n**Pet names:** ${tu?.titles ?? "—"}\n**About:** ${tu?.about ?? "—"}\n**Limits:** ${tu?.limits ?? "—"}\n**Collared by:**\n${collines}\n**Completed tasks:** ${done}\n**Dommes released them:** ${tu?.dommeReleases ?? 0}`
    );
    return i.reply({ embeds: [e] });
  }
}


export default cmd;
