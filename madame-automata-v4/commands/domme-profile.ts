import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../lib/db.js';
import { speak, M } from '../lib/goth.js';

export const data = new SlashCommandBuilder()
  .setName('domme-profile')
  .setDescription('See a Domme’s collars, contracts, protections, consideration, jails, worship received')
  .addUserOption(o => o.setName('dom').setDescription('Domme').setRequired(true));

export async function execute(i:any){
  const dom = i.options.getUser('dom', true);

  const collars = await prisma.relationship.findMany({
    where:{ guildId:i.guildId!, domId:dom.id, status:'active' }, select:{ subId:true }
  });

  const underCons = await prisma.relationship.findMany({
    where:{ guildId:i.guildId!, domId:dom.id, status:'consider' }, select:{ subId:true }
  });

  const contracts = await prisma.contract.findMany({
    where:{ guildId:i.guildId!, domId:dom.id, status:'active' }, select:{ subId:true }
  });

  // If your Jail model doesn't have createdBy, this will be 0.
  let jailCount = 0;
  try {
    // @ts-ignore createdBy may exist in your schema
    jailCount = await prisma.jail.count({ where:{ guildId:i.guildId!, createdBy: dom.id } });
  } catch {}

  const worshipCount = (await prisma.profile.findFirst({ where:{ guildId:i.guildId!, userId: dom.id } }))?.worshipCount || 0;

  const protects = await prisma.consent.findMany({
    where:{ guildId:i.guildId!, limits:'PROTECTED' }, select:{ userId:true }
  });

  const fmtList = (arr:{subId?:string, userId?:string}[], key:'subId'|'userId') =>
    arr.length ? arr.map(x=>`<@${x[key] as string}>`).join(', ') : '—';

  const fields = [
    { name:'Collared',            value: fmtList(collars, 'subId') },
    { name:'Under Contract',      value: fmtList(contracts as any, 'subId') },
    { name:'Under Consideration', value: fmtList(underCons, 'subId') },
    { name:'Protecting',          value: fmtList(protects as any, 'userId') },
    { name:'Jails Issued',        value: String(jailCount), inline:true },
    { name:'Worship Received',    value: String(worshipCount), inline:true },
  ];

  await i.reply({
    content: M.user(dom.id),
    allowedMentions:{ users:[dom.id] },
    embeds:[speak.ok('Domme Profile','',fields)]
  });
}
