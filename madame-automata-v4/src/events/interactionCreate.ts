import { Interaction, ChatInputCommandInteraction } from 'discord.js';
import { logger } from '../lib/logger.js';
export async function interactionCreate(interaction: Interaction) {
  try {
    if (interaction.isChatInputCommand()) {
      const name = interaction.commandName;
      const mod = await import(`../commands/${name}.ts`).catch(() => null);
      if (!mod?.execute) return;
      await mod.execute(interaction as ChatInputCommandInteraction);
    }
  } catch (e) {
    logger.error(e, 'Error handling interaction');
    if (interaction.isRepliable()) await interaction.reply({ content: 'Something went wrong. The halls whisper apologies.', ephemeral: true }).catch(()=>{});
  }
}
