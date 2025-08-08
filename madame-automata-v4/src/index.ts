import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { buildClient } from './lib/client.js';
import { registerEvents } from './events/registry.js';
import { logger } from './lib/logger.js';

export const prisma = new PrismaClient();
export const client = buildClient();

(async () => {
  try {
    await registerEvents(client);
    await client.login(process.env.DISCORD_TOKEN);
    logger.info('Madame Automata: Awakened.');
  } catch (err) {
    logger.error(err, 'Failed to start bot');
    process.exit(1);
  }
})();
