import { SlashCommandBuilder } from 'discord.js';
export const data=new SlashCommandBuilder().setName('help-safeword').setDescription('How safeword works here');
export async function execute(i:any){ const word=process.env.SAFEWORD||'mercy'; await i.reply({ content:`Use **/safeword** at any time. Current word: **${word}**. Moderators will be alerted.`, ephemeral:true }); }
