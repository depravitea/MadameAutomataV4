import { SlashCommandBuilder } from 'discord.js';
import { isEnabled } from '../lib/flags.js';
export const data=new SlashCommandBuilder().setName('lovense-connect').setDescription('Connect to your Lovense toy (placeholder)');
export async function execute(i:any){ if(!await isEnabled(i.guildId!,'lovense')) return i.reply({ content:'Lovense features are disabled.',ephemeral:true}); await i.reply({ content:'Connection placeholder. (Integrate official API when ready.)' }); }
