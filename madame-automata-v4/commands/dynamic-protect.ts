import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from '../lib/db.js';
import { M } from '../lib/goth.js';
import { Buttons } from '../lib/ids.js';
export const data=new SlashCommandBuilder().setName('dynamic-protect')
  .setDescription('Offer protection. Sub must accept.')
  .addUserOption(o=>o.setName('sub').setDescription('Submissive').setRequired(true))
  .addStringOption(o=>o.setName('note').setDescription('Optional note'))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
export async function execute(i:any){
  const sub=i.options.getUser('sub',true);
  const note=i.options.getString('note')||'';
  const p=await prisma.pendingRequest.create({ data:{ guildId:i.guildId!, type:'protect', domId:i.user.id, subId:sub.id, payload: JSON.stringify({ note }) } } as any);
  const row=new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(Buttons.accept(p.id)).setLabel('Accept').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(Buttons.decline(p.id)).setLabel('Decline').setStyle(ButtonStyle.Danger)
  );
  await i.reply({ content:`${M.user(sub.id)}`, allowedMentions:{ users:[sub.id] },
    embeds:[{ title:'༺ ❦ Protection Offer ❦ ༻', description:`${M.user(i.user.id)} offers protection.${note? `\n**Note:** ${note}`:''}` } as any],
    components:[row] });
}
