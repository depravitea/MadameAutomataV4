import { prisma } from './db.js';
export async function ensureProfile(guildId: string, userId: string) {
  let p = await prisma.profile.findUnique({ where: { id: `${guildId}-${userId}` } });
  if (!p) p = await prisma.profile.create({ data: { id: `${guildId}-${userId}`, guildId, userId } });
  return p;
}
export async function addXP(guildId: string, userId: string, amount: number) {
  const p = await ensureProfile(guildId, userId);
  return prisma.profile.update({ where: { id: p.id }, data: { xp: { increment: amount } } });
}
export async function addGems(guildId: string, userId: string, amount: number, kind='grant', meta?: string) {
  const p = await ensureProfile(guildId, userId);
  await prisma.economyTx.create({ data: { guildId, userId, kind, amount, meta } });
  return prisma.profile.update({ where: { id: p.id }, data: { gems: { increment: amount } } });
}
export async function spendGems(guildId: string, userId: string, amount: number) {
  const p = await ensureProfile(guildId, userId);
  if (p.gems < amount) return false;
  await prisma.economyTx.create({ data: { guildId, userId, kind: 'spend', amount: -amount } });
  await prisma.profile.update({ where: { id: p.id }, data: { gems: { decrement: amount } } });
  return true;
}
