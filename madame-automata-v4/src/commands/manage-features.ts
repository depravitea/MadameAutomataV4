import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { setFlag } from '../lib/flags.js';
export const data=new SlashCommandBuilder().setName('manage-features').setDescription('Enable/disable features').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption(o=>o.setName('key').setDescription('Feature key (nsfw, lovense)').setRequired(true))
  .addBooleanOption(o=>o.setName('enabled').setDescription('Enable?').setRequired(true));
export async function execute(i){ const key=i.options.getString('key',true); const enabled=i.options.getBoolean('enabled',true); await setFlag(i.guildId!,key,enabled); await i.reply({content:`Feature **${key}** is **${enabled?'enabled':'disabled'}**.`}); }
