import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export const data=new SlashCommandBuilder().setName('manage-roles').setDescription('Assign roles as needed (placeholder)').setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
export async function execute(i:any){ await i.reply({ content:'Use your existing role menus or moderation tools. (Panel command coming next build.)', ephemeral:true }); }
