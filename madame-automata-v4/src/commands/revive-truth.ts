import { SlashCommandBuilder } from 'discord.js';
const CARDS=['What rule do you secretly love being given?','What task would you do eagerly for your Domme?','What boundary are you proud of keeping?'];
export const data=new SlashCommandBuilder().setName('revive-truth').setDescription('Draw a Truth card');
export async function execute(i:any){ const pick=CARDS[Math.floor(Math.random()*CARDS.length)]!; await i.reply({ content:`**Truth:** ${pick}`}); }
