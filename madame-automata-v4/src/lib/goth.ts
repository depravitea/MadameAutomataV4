import { EmbedBuilder } from 'discord.js';
import { theme } from './theme.js';
export function gothicEmbed(title: string, description?: string) {
  return new EmbedBuilder().setTitle(`${theme.ornament} ${title} ${theme.ornament}`).setDescription(description||'').setColor(parseInt(theme.primary.replace('#',''),16)).setFooter({ text: theme.footer });
}
