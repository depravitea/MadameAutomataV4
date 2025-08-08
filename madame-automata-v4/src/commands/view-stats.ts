import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
import { gothicEmbed } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('view-stats').setDescription('Overview of setup and activity');
export async function execute(i){ const g=i.guildId!; const users=await prisma.user.count({where:{guildId:g}}).catch(()=>0); const rels=await prisma.relationship.count({where:{guildId:g,status:'active'}}).catch(()=>0); const punish=await prisma.punishment.count({where:{guildId:g}}).catch(()=>0); const profiles=await prisma.profile.count({where:{guildId:g}}).catch(()=>0);
  await i.reply({ embeds:[gothicEmbed('Empyrean Status',`Members: **${users}**\nActive Ownerships: **${rels}**\nPunishments: **${punish}**\nProfiles: **${profiles}**`)] });
}
