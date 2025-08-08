import { SlashCommandBuilder } from 'discord.js';
import { addXP } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('brat-rebel').setDescription('Rebel against a Domme');
export async function execute(i:any){ await addXP(i.guildId!, i.user.id, 1); await i.reply({ content:`${i.user} tests the leash with a smirk.`}); }
