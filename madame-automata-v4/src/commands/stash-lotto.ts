import { SlashCommandBuilder } from 'discord.js';
export const data=new SlashCommandBuilder().setName('stash-lotto').setDescription('Enter the lotto (placeholder)');
export async function execute(i:any){ await i.reply({ content:'Lotto coming soon (command reserved).' }); }
