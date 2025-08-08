import { SlashCommandBuilder } from 'discord.js';
import { addXP } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('dynamic-praise').setDescription('Praise a submissive').addUserOption(o=>o.setName('sub').setDescription('Submissive').setRequired(true));
export async function execute(i:any){ const sub=i.options.getUser('sub',true); await addXP(i.guildId!, sub.id, 5); await i.reply({ content:`${sub} is praised.` }); }
