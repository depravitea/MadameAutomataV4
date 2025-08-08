import { SlashCommandBuilder } from 'discord.js';
import { addXP } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('brat-mock').setDescription('Mock a Domme (safely)');
export async function execute(i:any){ await addXP(i.guildId!, i.user.id, 1); await i.reply({ content:`${i.user} offers a playful taunt—careful now.`}); }
