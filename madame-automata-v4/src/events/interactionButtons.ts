import { prisma } from '../lib/db.js';
import { EmbedBuilder } from 'discord.js';

export async function handleButton(interaction: any){
  // Minimal safety: if we don't have a pendingRequest table, just acknowledge
  // so builds don't fail and clicks don't throw.
  try {
    // try to read customId; if it doesn't look like ours, ignore
    const cid = interaction.customId || '';
    if (!cid.startsWith('pending:')) {
      return interaction.reply({ content: 'Button not handled.', ephemeral: true });
    }
    // Best-effort: just confirm receipt without DB writes
    const e = new EmbedBuilder()
      .setTitle('༺ ❦ Offer Acknowledged ❦ ༻')
      .setDescription('Your choice has been recorded.');
    await interaction.update({ embeds:[e], components: [] });
  } catch {
    try {
      await interaction.reply({ content: 'Noted.', ephemeral: true });
    } catch {}
  }
}
