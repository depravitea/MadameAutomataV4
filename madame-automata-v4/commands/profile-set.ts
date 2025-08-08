import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
import { speak } from '../lib/goth.js';
export const data=new SlashCommandBuilder().setName('profile-set').setDescription('Update your profile details')
  .addStringOption(o=>o.setName('about').setDescription('About you'))
  .addStringOption(o=>o.setName('limits').setDescription('Limits'))
  .addStringOption(o=>o.setName('kinks').setDescription('Kinks'))
  .addStringOption(o=>o.setName('title').setDescription('Your Domme title (if applicable)'));
export async function execute(i:any){
  const about=i.options.getString('about')||undefined;
  const limits=i.options.getString('limits')||undefined;
  const kinks=i.options.getString('kinks')||undefined;
  const title=i.options.getString('title')||undefined;
  await prisma.profile.upsert({
    where:{ userId:i.user.id },
    update:{ about, limits, kinks, title },
    create:{ id:crypto.randomUUID(), guildId:i.guildId!, userId:i.user.id, about, limits, kinks, title }
  } as any);
  await i.reply({ embeds:[speak.ok('Profile Updated','Your details are set.')] });
}
