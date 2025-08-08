import { SlashCommandBuilder } from 'discord.js';
import { gothicEmbed as E } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('view-guide').setDescription('In-server configuration guide');
export async function execute(i:any){ await i.reply({ embeds:[E('Guide','Consent-first. Use /manage-setup → /config → /manage-features. Roles: Domme/Sub/Blindfold.')], ephemeral: true }); }
