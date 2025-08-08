import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { theme } from '../lib/theme.js';
export const data = new SlashCommandBuilder().setName('help').setDescription('Show help for Madame Automata');
export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setTitle(`${theme.ornament} Madame Automata Help ${theme.ornament}`)
    .setDescription([
      '**Management**: /manage-setup, /manage-features, /view-stats, /view-tracker, /view-guide',
      '**Dynamic**: /dynamic-own, /dynamic-disown, /dynamic-protect, /dynamic-unprotect, /dynamic-breakup, /dynamic-praise, /dynamic-worship, /dynamic-simp, /dynamic-ranksub, /dynamic-quiz',
      '**Punishments**: /punish-censor, /punish-brand, /punish-gag, /punish-bondage, /punish-muff, /punish-blind, /punish-strike, /punish-wop, /jail-lock, /jail-unlock, /jail-escape, /jail-beg',
      '**Brat**: /brat-hide, /brat-rebel, /brat-mock',
      '**Economy**: /stash-work, /stash-give, /stash-dice, /stash-flip, /stash-leader',
      '**Games**: /riddle-new, /riddle-guess, /riddle-hint, /riddle-end, /revive-truth, /revive-dare, /revive-nhie, /revive-wyr',
      '**Hub**: /user-profile, /user-limits, /todo, /todo_assign, /todo_list, /todo_private, /log, /logs_list, /logs_private',
      '**Interactions**: /give-cuddle, /give-hug, /give-kiss, /give-pat, /give-slap, /give-poke, /give-tickle',
      '**Bot**: /view-help, /view-status, /view-level',
      '**NSFW/Lovense**: (feature-gated) /nsfw-*, /lovense-*'
    ].join('\n'))
    .setColor(parseInt(theme.primary.replace('#',''), 16))
    .setFooter({ text: theme.footer });
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
