import { SlashCommandBuilder } from 'discord.js';
import { addXP } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('dynamic-worship').setDescription('Worship a Domme').addUserOption(o=>o.setName('dom').setDescription('Domme').setRequired(true));
export async function execute(i:any){ const dom=i.options.getUser('dom',true); await addXP(i.guildId!, i.user.id, 3); await i.reply({ content:`${i.user} kneels to ${dom}.`}); }
