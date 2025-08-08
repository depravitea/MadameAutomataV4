import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('jail-unlock').setDescription('Unlock someone from jail').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);
export async function execute(i:any){ const u=i.options.getUser('user',true); await prisma.jail.deleteMany({ where:{ guildId:i.guildId!, userId:u.id } }); await i.reply({ content:`${u} is free.`}); }
