import { SlashCommandBuilder } from 'discord.js';
export const data=new SlashCommandBuilder().setName('jail-beg').setDescription('Beg for release from jail');
export async function execute(i:any){ await i.reply({ content:`${i.user} begs prettily for release.`}); }
