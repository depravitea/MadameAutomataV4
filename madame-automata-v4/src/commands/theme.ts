import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { theme } from '../lib/theme.js';
export const data = new SlashCommandBuilder().setName('theme').setDescription('Preview the current theme');
export async function execute(interaction) {
  const e = new EmbedBuilder().setTitle(`${theme.ornament} Crimson Ornaments ${theme.ornament}`).setDescription('Crimson Peak × Nosferatu — deep shadows, bone parchment, and quiet menace.').setColor(parseInt(theme.primary.replace('#',''),16)).setFooter({ text: theme.footer });
  await interaction.reply({ embeds: [e] });
}
