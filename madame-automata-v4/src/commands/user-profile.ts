import { SlashCommandBuilder } from 'discord.js';
import { ensureProfile } from '../lib/economy.js';
import { prisma } from '../lib/db.js';
export const data=new SlashCommandBuilder().setName('user-profile').setDescription('View a user profile').addUserOption(o=>o.setName('user').setDescription('User'));
export async function execute(i:any){ const user=i.options.getUser('user')||i.user; const p=await ensureProfile(i.guildId!,user.id); const owned=await prisma.relationship.findFirst({ where:{ guildId:i.guildId!, subId:user.id, status:'active'} }).catch(()=>null); await i.reply({ content:`User: ${user}\nXP: **${p.xp}**\nGems: **${p.gems}**\nSimps: **${p.simpCount}**\nOwned: **${!!owned}**`}); }
