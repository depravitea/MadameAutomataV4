import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from '../lib/db.js';
import { M } from '../lib/goth.js';
import { Buttons } from '../lib/ids.js';
export const data=new SlashCommandBuilder().setName('dynamic-contract')
  .setDescription('Draft and send a contract; sub must accept via buttons')
  .addUserOption(o=>o.setName('sub').setDescription('Submissive').setRequired(true))
  .addStringOption(o=>o.setName('terms').setDescription('Contract terms').setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
export async function execute(i:any){
  const sub=i.options.getUser('sub',true);
  const terms=i.options.getString('terms',true);
  const p=await prisma.pendingRequest.create({ data:{ guildId:i.guildId!, type:'contract', domId:i.user.id, subId:sub.id, payload: JSON.stringify({ terms }) } } as any);
  const row=new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(Buttons.accept(p.id)).setLabel('Accept').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(Buttons.decline(p.id)).setLabel('Decline').setStyle(ButtonStyle.Danger)
  );
  await i.reply({ content:`${M.user(sub.id)}`, allowedMentions:{ users:[sub.id] },
    embeds:[{ title:'༺ ❦ Contract Offer ❦ ༻', description:`**Terms:**\n${terms}` } as any],
    components:[row] });
}
