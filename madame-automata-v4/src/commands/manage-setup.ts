import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { gothicEmbed as E } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('manage-setup').setDescription('Initial setup helper').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
export async function execute(i:any){ await i.reply({ embeds:[E('Setup', ['1) Create roles **Domme**, **Sub**, **Blindfold**','2) /config each role/channel ID','3) /manage-features to toggle nsfw/lovense'].join('\n'))] }); }
