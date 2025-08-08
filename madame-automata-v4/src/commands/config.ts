import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../lib/db.js';
export const data = new SlashCommandBuilder()
  .setName('config').setDescription('Configure guild settings').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption(o=>o.setName('key').setDescription('key').setRequired(true).addChoices(
    { name:'logChannelId', value:'logChannelId' },{ name:'domRoleId', value:'domRoleId' },{ name:'subRoleId', value:'subRoleId' },{ name:'blindfoldRole', value:'blindfoldRole' },{ name:'markFormat', value:'markFormat' },{ name:'themePrimary', value:'themePrimary' }))
  .addStringOption(o=>o.setName('value').setDescription('value').setRequired(true));
export async function execute(i){ const key=i.options.getString('key',true); const value=i.options.getString('value',true);
  await prisma.guild.upsert({ where:{id:i.guildId!}, update:{ [key]: value }, create:{ id:i.guildId!, [key]: value } } as any);
  await i.reply({ content:`Config updated: **${key}** = \`${value}\`` });
}
