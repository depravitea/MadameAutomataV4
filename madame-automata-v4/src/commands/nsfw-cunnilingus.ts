import { SlashCommandBuilder } from 'discord.js';
import { isEnabled } from '../lib/flags.js';
export const data=new SlashCommandBuilder().setName('nsfw-cunnilingus').setDescription('NSFW scene (feature-gated)');
export async function execute(i:any){ if(!await isEnabled(i.guildId!,'nsfw')) return i.reply({ content:'NSFW features are disabled.',ephemeral:true}); await i.reply({ content:'NSFW action acknowledged. (Content per your server rules.)' }); }
