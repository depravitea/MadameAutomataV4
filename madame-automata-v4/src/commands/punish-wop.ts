import { SlashCommandBuilder } from 'discord.js';
const entries = ['5‑minute timeout','Rename with mark for 24h','Blindfold for 10m (no media channels)','Task: 3 compliments to staff','Task: Post a selfie with a crimson emoji'];
export const data=new SlashCommandBuilder().setName('punish-wop').setDescription('Wheel of punishments');
export async function execute(i){ const pick=entries[Math.floor(Math.random()*entries.length)]; await i.reply({ content:`The wheel creaks... **${pick}** for ${i.user}.`}); }
