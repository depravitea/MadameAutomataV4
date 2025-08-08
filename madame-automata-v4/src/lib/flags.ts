import { prisma } from './db.js';
export async function setFlag(guildId: string, key: string, enabled: boolean) {
  await prisma.featureFlag.upsert({ where: { guildId_key: { guildId, key } }, update: { enabled }, create: { guildId, key, enabled } });
}
export async function isEnabled(guildId: string, key: string) {
  const f = await prisma.featureFlag.findUnique({ where: { guildId_key: { guildId, key } } });
  return !!f?.enabled;
}
