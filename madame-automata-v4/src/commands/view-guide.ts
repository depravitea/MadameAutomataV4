import { SlashCommandBuilder } from 'discord.js'; import { gothicEmbed } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('view-guide').setDescription('In-server configuration guide');
export async function execute(i){ await i.reply({ embeds:[gothicEmbed('Welcome to the Empyrean','Consent-first. Use /manage-setup to begin; toggle features via /manage-features.')], ephemeral:true}); }
