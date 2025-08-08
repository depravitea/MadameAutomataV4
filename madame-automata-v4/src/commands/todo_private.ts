import { SlashCommandBuilder } from 'discord.js';
export const data=new SlashCommandBuilder().setName('todo_private').setDescription('Hint for private to-dos');
export async function execute(i:any){ await i.reply({ content:'Use /todo add private:true for private notes.', ephemeral:true }); }
