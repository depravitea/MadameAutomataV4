import { Client, Events } from 'discord.js';
import { ready } from './ready.js';
import { interactionCreate } from './interactionCreate.js';
import { guildMemberAdd } from './guildMemberAdd.js';
export async function registerEvents(client: Client) {
  client.once(Events.ClientReady, (c) => ready(c));
  client.on(Events.InteractionCreate, (i) => interactionCreate(i));
  client.on(Events.GuildMemberAdd, (m) => guildMemberAdd(m));
}
