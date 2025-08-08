import { SlashCommandBuilder } from 'discord.js';
import { spendGems, addGems } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('stash-give').setDescription('Give gems to someone').addUserOption(o=>o.setName('user').setDescription('Recipient').setRequired(true)).addIntegerOption(o=>o.setName('amount').setDescription('Gems').setRequired(true));
export async function execute(i:any){ const u=i.options.getUser('user',true); const amt=i.options.getInteger('amount',true); const ok=await spendGems(i.guildId!, i.user.id, amt); if(!ok) return i.reply({ content:'Not enough gems.',ephemeral:true}); await addGems(i.guildId!, u.id, amt, 'gift', `from:${i.user.id}`); await i.reply({ content:`Gave **${amt}** 💎 to ${u}.`}); }
