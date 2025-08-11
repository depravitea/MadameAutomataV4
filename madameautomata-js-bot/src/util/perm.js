import { prisma } from "../lib/prisma.js";

function hasRoleName(member, names = []) {
  if (!member?.roles?.cache) return false;
  const set = new Set(names.map(n => n.toLowerCase()));
  for (const r of member.roles.cache.values()) {
    if (set.has(r.name.toLowerCase())) return true;
  }
  return false;
}

export async function getConfig() {
  let row = await prisma.config.findUnique({ where: { id: 1 } });
  if (!row) row = await prisma.config.create({ data: { id: 1 } });
  return row;
}

export async function isDomme(member) {
  if (!member) return false;
  const cfg = await getConfig();
  if (cfg.dommeRoleId && member.roles?.cache?.has(cfg.dommeRoleId)) return true;
  if (hasRoleName(member, ["Domme", "Mistress", "Dominant"])) return true;
  if (member.permissions?.has("ManageGuild") || member.permissions?.has("ManageRoles")) return true;
  return false;
}

export async function isSub(member) {
  if (!member) return false;
  const cfg = await getConfig();
  if (cfg.subRoleId && member.roles?.cache?.has(cfg.subRoleId)) return true;
  if (hasRoleName(member, ["Sub", "Submissive", "Pet", "Slave"])) return true;
  return false;
}

export async function isStaff(member) {
  if (!member) return false;
  const cfg = await getConfig();
  if (cfg.staffRoleId && member.roles?.cache?.has(cfg.staffRoleId)) return true;
  if (hasRoleName(member, ["Staff", "Owner", "Admin", "Mod", "Moderator"])) return true;
  if (member.permissions?.has("Administrator")) return true;
  return false;
}
