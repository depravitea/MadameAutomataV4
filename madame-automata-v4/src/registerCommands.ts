import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { getAllSlashCommands } from './lib/loader.js';
import { logger } from './lib/logger.js';

(async () => {
  const token = process.env.DISCORD_TOKEN!;
  const clientId = process.env.DISCORD_CLIENT_ID!;
  const guildId = process.env.GUILD_ID;
  const commands = await getAllSlashCommands();
  const rest = new REST({ version: '10' }).setToken(token);
  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      logger.info(`Registered ${commands.length} guild commands to ${guildId}`);
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      logger.info(`Registered ${commands.length} global commands`);
    }
  } catch (e) { logger.error(e, 'Failed to register commands'); }
})();
