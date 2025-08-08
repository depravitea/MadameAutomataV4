import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js'; import { RIDDLES } from '../lib/riddleBank.js';
export const data=new SlashCommandBuilder().setName('riddle-new').setDescription('Start a new BDSM-themed riddle');
export async function execute(i){ const pick=RIDDLES[Math.floor(Math.random()*RIDDLES.length)]; await prisma.riddle.create({ data:{ guildId:i.guildId!, channelId:i.channelId, question:pick.q, answer:pick.a, hint:pick.h } }); await i.reply({ content:`Riddle: **${pick.q}**`}); }
