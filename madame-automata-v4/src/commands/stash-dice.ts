import { SlashCommandBuilder } from 'discord.js';
import { spendGems, addGems } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('stash-dice').setDescription('Roll dice to win/lose gems').addIntegerOption(o=>o.setName('wager').setDescription('Wager').setRequired(true));
export async function execute(i:any){ const w=i.options.getInteger('wager',true); const ok=await spendGems(i.guildId!, i.user.id, w); if(!ok) return i.reply({ content:'Not enough gems.',ephemeral:true}); const roll=Math.floor(Math.random()*6)+1; if(roll>=4){ await addGems(i.guildId!, i.user.id, w*2, 'dice'); await i.reply({ content:`You rolled ${roll}. You win **${w}** 💎 net.`}); } else { await i.reply({ content:`You rolled ${roll}. You lost your wager.`}); } }
