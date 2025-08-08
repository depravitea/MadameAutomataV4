import { GuildMember } from 'discord.js';
import { theme } from '../lib/theme.js';
export async function guildMemberAdd(member: GuildMember) {
  const ch: any = member.guild.systemChannel || member.guild.channels.cache.find((c: any) => c.isTextBased() && c.name.includes('welcome'));
  if (!ch || !ch.isTextBased()) return;
  await ch.send({ embeds: [{ title: `${theme.ornament} A New Footstep Echoes ${theme.ornament}`, description: `Welcome, ${member}. Verify with **/verify** to enter.`, color: parseInt(theme.primary.replace('#',''), 16) }] });
}
