import {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";
import { prisma } from "../lib/prisma.js";
import { gothicEmbed } from "../theme/theme.js";
import { isDomme } from "../util/perm.js";
import { cuid } from "../util/ids.js";

const cmd = {
  data: new SlashCommandBuilder()
    .setName("collar")
    .setDescription("Collar a submissive with consent (type select + Accept/Decline).")
    .addUserOption(o => o.setName("sub").setDescription("Submissive").setRequired(true)),

  async run(i) {
    if (!await isDomme(i.member)) {
      return i.reply({ content: "Only Dommes can use this.", ephemeral: true });
    }
    const sub = i.options.getUser("sub", true);

    // 1) Type select
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`collar-type:${i.id}`)
      .setPlaceholder("Select collar type")
      .addOptions(
        { label: "Consideration Collar", value: "CONSIDERATION", description: "Trial, but serious." },
        { label: "Training Collar", value: "TRAINING", description: "Active shaping & obedience." },
        { label: "Permanent Collar", value: "PERMANENT", description: "Lifetime devotion." }
      );
    const row = new ActionRowBuilder().addComponents(menu);

    await i.reply({
      embeds: [gothicEmbed("Collar Selection", `Choose a collar for **<@${sub.id}>**.`)],
      components: [row]
    });

    const msg = await i.fetchReply();
    const picked = await msg.awaitMessageComponent({
      time: 120000,
      filter: (x) => x.user.id === i.user.id && x.customId.startsWith("collar-type:")
    }).catch(() => null);

    if (!picked) return; // leave message as-is

    const collarValue = picked.values[0];
    await picked.update({
      embeds: [gothicEmbed("Consent Required", `**<@${sub.id}>**, do you accept the **${collarValue}** collar from **<@${i.user.id}>**?`)],
      components: []
    });

    // 2) Consent buttons
    const acceptBtn = new ButtonBuilder().setCustomId(`collar-accept:${i.id}`).setLabel("Accept").setStyle(ButtonStyle.Success);
    const declineBtn = new ButtonBuilder().setCustomId(`collar-decline:${i.id}`).setLabel("Decline").setStyle(ButtonStyle.Danger);
    const row2 = new ActionRowBuilder().addComponents(acceptBtn, declineBtn);

    const consentMsg = await i.followUp({ components: [row2] });

    const pressed = await consentMsg.awaitMessageComponent({
      time: 120000,
      filter: (x) =>
        x.user.id === sub.id &&
        (x.customId === `collar-accept:${i.id}` || x.customId === `collar-decline:${i.id}`)
    }).catch(() => null);

    if (!pressed) {
      return consentMsg.edit({
        embeds: [gothicEmbed("Consent Timeout", "No response from the sub.")],
        components: []
      });
    }

    if (pressed.customId.startsWith("collar-accept")) {
      await prisma.user.upsert({ where: { id: sub.id }, update: { isSub: true }, create: { id: sub.id, isSub: true } });
      await prisma.user.upsert({ where: { id: i.user.id }, update: { isDomme: true }, create: { id: i.user.id, isDomme: true } });
      await prisma.collaring.create({ data: { id: cuid(), dommeId: i.user.id, subId: sub.id, type: collarValue, active: true } });

      return pressed.update({
        embeds: [gothicEmbed("Collar Accepted", `<@${sub.id}> is now collared by <@${i.user.id}> (type: ${collarValue}).`)],
        components: []
      });
    } else {
      return pressed.update({
        embeds: [gothicEmbed("Collar Declined", `<@${sub.id}> declined the collar from <@${i.user.id}>.`)],
        components: []
      });
    }
  }
};

export default cmd;
