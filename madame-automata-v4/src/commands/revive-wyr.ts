import { SlashCommandBuilder } from 'discord.js';
const CARDS=['Would you rather earn praise or avoid punishment?','Would you rather hold rope or hold rules?','Would you rather serve in public or in private?'];
export const data=new SlashCommandBuilder().setName('revive-wyr').setDescription('Would You Rather');
export async function execute(i:any){ const pick=Math.floor(Math.random()*CARDS.length); await i.reply({ content:`**WYR:** ${CARDS[pick]}`}); }
