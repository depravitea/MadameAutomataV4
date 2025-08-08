import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('dynamic-quiz').setDescription('Take a dynamic quiz (placeholder)');
export async function execute(i:any){ const sample={ alignment:'Service-Oriented', intensity:'Medium', limits:['stingy pain','public'], prefs:['praise','protocol'] }; await prisma.quizResult.create({ data:{ guildId:i.guildId!, userId:i.user.id, result: JSON.stringify(sample) } }); await i.reply({ content:'Quiz stored. (Replace with your real quiz later.)', ephemeral:true }); }
