import { SlashCommandBuilder } from 'discord.js';
const CARDS=['Write a polite apology to a staff member.','Compliment three people in the next hour.','Change your nickname to include a crimson heart for 24h.'];
export const data=new SlashCommandBuilder().setName('revive-dare').setDescription('Draw a Dare card');
export async function execute(i:any){ const pick=CARDS[Math.floor(Math.random()*CARDS.length)]!; await i.reply({ content:`**Dare:** ${pick}`}); }
