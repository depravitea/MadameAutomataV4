import { SlashCommandBuilder } from 'discord.js';
const CARDS=['Never have I ever forgotten a safeword.','Never have I ever been bratty on purpose.','Never have I ever broken a contract rule.'];
export const data=new SlashCommandBuilder().setName('revive-nhie').setDescription('Never Have I Ever');
export async function execute(i:any){ const pick=CARDS[Math.floor(Math.random()*CARDS.length)]!; await i.reply({ content:`**NHIE:** ${pick}`}); }
