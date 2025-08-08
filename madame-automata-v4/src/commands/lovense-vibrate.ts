import { SlashCommandBuilder } from 'discord.js';
import { isEnabled } from '../lib/flags.js';
export const data=new SlashCommandBuilder().setName('lovense-vibrate').setDescription('Lovense control (feature-gated placeholder)');
export async function execute(i:any){ if(!await isEnabled(i.guildId!,'lovense')) return i.reply({ content:'Lovense features are disabled.',ephemeral:true}); await i.reply({ content:'Lovense placeholder executed.' }); }
