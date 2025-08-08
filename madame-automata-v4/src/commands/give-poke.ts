import { SlashCommandBuilder } from 'discord.js';
import { spendGems } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('give-poke').setDescription('Poke someone').addUserOption(o=>o.setName('user').setDescription('Target').setRequired(true));
export async function execute(i:any){ const u=i.options.getUser('user',true); const ok=await spendGems(i.guildId!, i.user.id, 2); if(!ok) return i.reply({ content:'Not enough gems.',ephemeral:true}); await i.reply({ content:`${i.user} pokes ${u}.`}); }
