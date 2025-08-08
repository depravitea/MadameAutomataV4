import { SlashCommandBuilder } from 'discord.js';
import { spendGems, addGems } from '../lib/economy.js';
const moves = ['rock','paper','scissors'] as const;
export const data=new SlashCommandBuilder().setName('stash-rps').setDescription('Rock–Paper–Scissors for gems').addIntegerOption(o=>o.setName('wager').setDescription('Gems').setRequired(true)).addStringOption(o=>o.setName('move').setDescription('rock/paper/scissors').setRequired(true));
export async function execute(i:any){
  const w=i.options.getInteger('wager',true);
  const m=i.options.getString('move',true).toLowerCase();
  if(!moves.includes(m as any)) return i.reply({ content:'Choose rock, paper, or scissors.',ephemeral:true});
  const ok=await spendGems(i.guildId!, i.user.id, w);
  if(!ok) return i.reply({ content:'Not enough gems.',ephemeral:true});
  const bot=moves[Math.floor(Math.random()*3)]!;
  const win=(m==='rock'&&bot==='scissors')||(m==='paper'&&bot==='rock')||(m==='scissors'&&bot==='paper');
  if(win){ await addGems(i.guildId!, i.user.id, w*2, 'rps'); await i.reply({ content:`You played **${m}**, I played **${bot}**. You win **${w}** 💎 net.`}); }
  else if(m===bot){ await addGems(i.guildId!, i.user.id, w, 'rps-refund'); await i.reply({ content:`Tie: we both chose **${m}**. Your wager is returned.`}); }
  else { await i.reply({ content:`You played **${m}**, I played **${bot}**. You lose your wager.`}); }
}
