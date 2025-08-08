import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('riddle-guess').setDescription('Guess the active riddle').addStringOption(o=>o.setName('answer').setDescription('Your guess').setRequired(true));
export async function execute(i:any){ const r=await prisma.riddle.findFirst({ where:{ guildId:i.guildId!, channelId:i.channelId, active:true } }); if(!r) return i.reply({ content:'No active riddle here.',ephemeral:true}); const guess=i.options.getString('answer',true).trim().toLowerCase(); if(guess===r.answer.toLowerCase()){ await prisma.riddle.update({ where:{ id:r.id }, data:{ active:false } }); await i.reply({ content:'Correct.' }); } else { await i.reply({ content:'Not quite.'}); } }
