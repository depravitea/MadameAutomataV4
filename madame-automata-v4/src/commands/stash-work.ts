import { SlashCommandBuilder } from 'discord.js';
import { addGems } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('stash-work').setDescription('Work to earn gems');
export async function execute(i:any){ const amt=Math.floor(Math.random()*4)+2; await addGems(i.guildId!, i.user.id, amt, 'work'); await i.reply({ content:`You earned **${amt}** 💎.`}); }
