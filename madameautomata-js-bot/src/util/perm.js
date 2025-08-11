
import { prisma } from "../lib/prisma.js";

export async function getConfig() {
  let row = await prisma.config.findUnique({ where: { id: 1 } });
  if (!row) {
    row = await prisma.config.create({ data: { id: 1 } });
  }
  return row;
}
export async function isDomme(member) {
  if (!member) return false;
  const cfg = await getConfig();
  return !!cfg.dommeRoleId && member.roles?.cache?.has(cfg.dommeRoleId);
}
export async function isSub(member) {
  if (!member) return false;
  const cfg = await getConfig();
  return !!cfg.subRoleId && member.roles?.cache?.has(cfg.subRoleId);
}
export async function isStaff(member) {
  if (!member) return false;
  const cfg = await getConfig();
  return !!cfg.staffRoleId && member.roles?.cache?.has(cfg.staffRoleId);
}
