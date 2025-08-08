import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
import { ensureProfile } from '../lib/economy.js';
export const data=new SlashCommandBuilder().setName('view-status').setDescription('Show your bot status');
export async function execute(i:any){ const p=await ensureProfile(i.guildId!,i.user.id); const rel=await prisma.relationship.findFirst({ where:{ guildId:i.guildId!, subId:i.user.id, status:'active'}, select:{ id:true } }).catch(()=>null); await i.reply({ content:`Owned: **${!!rel}** | XP: **${p.xp}** | Gems: **${p.gems}**` }); }
