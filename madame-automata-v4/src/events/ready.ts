import { Client, ActivityType } from 'discord.js';
import { logger } from '../lib/logger.js';
export function ready(client: Client<true>) {
  logger.info(`Logged in as ${client.user.tag}`);
  client.user.setPresence({ activities: [{ name: 'your heartbeat in the dark', type: ActivityType.Listening }], status: 'dnd' });
}
