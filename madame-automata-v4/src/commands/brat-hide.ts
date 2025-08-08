import { SlashCommandBuilder } from 'discord.js';
import { addXP } from '../lib/economy.js';
export const data = new SlashCommandBuilder().setName('brat-hide').setDescription('Hide from a Domme temporarily');
export async function execute(i:any){ await addXP(i.guildId!, i.user.id, 1); await i.reply({ content:`${i.user} slips into the velvet shadows.`}); }
