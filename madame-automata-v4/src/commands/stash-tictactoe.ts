import { SlashCommandBuilder } from 'discord.js';
export const data=new SlashCommandBuilder().setName('stash-tictactoe').setDescription('Tic-Tac-Toe for gems (placeholder)');
export async function execute(i:any){ await i.reply({ content:'Tic-Tac-Toe coming soon (command reserved).' }); }
