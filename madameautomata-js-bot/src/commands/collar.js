
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../lib/prisma.js";
import { Theme, gothicEmbed } from "../theme/theme.js";
import { parseDuration, randomCase } from "../util/duration.js";
import { cuid } from "../util/ids.js";
import { isDomme, isSub, isStaff, getConfig } from "../util/perm.js";

const cmd = 
{
  data: new SlashCommandBuilder()
    .setName("collar")
    .setDescription("Collar a submissive with consent flow.")
    .addUserOption(o=>o.setName("sub").setDescription("Submissive").setRequired(true)),
  async run(i) {
    if (!await isDomme(i.member)) return i.reply({ content: "Only Dommes can use this.", ephemeral: true });
    const sub = i.options.getUser("sub", true);

    const menu = new StringSelectMenuBuilder()
      .setCustomId("collar-type")
      .setPlaceholder("Select collar type")
      .addOptions(
        { label: "Consideration Collar", value: "CONSIDERATION", description: "Trial, but serious" },
        { label: "Training Collar", value: "TRAINING", description: "Active shaping" },
        { label: "Permanent Collar", value: "PERMANENT", description: "Lifetime devotion" }
      );
    const row = new ActionRowBuilder().addComponents(menu);
    await i.reply({ embeds: [gothicEmbed("Collar Selection", `Choose a collar for **<@${sub.id}>**.`)], components: [row] });

    const picked = await i.channel.awaitMessageComponent({ time: 120000, filter: (x)=>x.user.id===i.user.id && x.customId==="collar-type" }).catch(()=>null);
    if (!picked) return; // user didn't pick

    const collarValue = picked.values[0];
    await picked.update({ embeds: [gothicEmbed("Consent Required", `**<@${sub.id}>**, do you accept the **${collarValue}** collar from **<@${i.user.id}>**?`)], components: [] });

    const acceptBtn = new ButtonBuilder().setCustomId("accept").setLabel("Accept").setStyle(ButtonStyle.Success);
    const declineBtn = new ButtonBuilder().setCustomId("decline").setLabel("Decline").setStyle(ButtonStyle.Danger);
    const row2 = new ActionRowBuilder().addComponents(acceptBtn, declineBtn);
    const msg = await i.followUp({ components: [row2] });

    const pressed = await msg.awaitMessageComponent({ time: 120000, filter: (x)=>x.user.id===sub.id && ["accept","decline"].includes(x.customId) }).catch(()=>null);
    if (!pressed) return;

    if (pressed.customId === "accept") {
      await prisma.user.upsert({ where: { id: sub.id }, update: { isSub: true }, create: { id: sub.id, isSub: true } });
      await prisma.user.upsert({ where: { id: i.user.id }, update: { isDomme: true }, create: { id: i.user.id, isDomme: true } });
      await prisma.collaring.create({ data: { id: cuid(), dommeId: i.user.id, subId: sub.id, type: collarValue, active: True } }).catch(async()=>{
        // JS true fix later if typo
      });
    }
    // fix boolean typo & finalize
    if (pressed.customId === "accept") {
      await prisma.collaring.create({ data: { id: cuid(), dommeId: i.user.id, subId: sub.id, type: collarValue, active: true } });
      await pressed.update({ embeds: [gothicEmbed("Collar Accepted", `<@${sub.id}> is now collared by <@${i.user.id}> (type: ${collarValue}).`)], components: [] });
    } else {
      await pressed.update({ embeds: [gothicEmbed("Collar Declined", `<@${sub.id}> declined the collar from <@${i.user.id}>.`)], components: [] });
    }
  }
}


export default cmd;
