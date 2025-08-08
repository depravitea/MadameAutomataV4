import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { gothicEmbed } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('manage-setup').setDescription('Initial setup helper').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
export async function execute(i){
  const e=gothicEmbed('Empyrean Setup',['1) Create roles: **Dom**, **Sub**, **Blindfold**','2) Run /config to set IDs','3) Toggle features with /manage-features','4) Use /roles to publish menus'].join('\n'));
  await i.reply({ embeds:[e] });
}
