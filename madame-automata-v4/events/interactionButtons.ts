import { parsePendingButton } from '../lib/ids.js';
import { prisma } from '../lib/db.js';
import { gothicEmbed } from '../lib/goth.js';

export async function handleButton(interaction: any){
  const info = parsePendingButton(interaction.customId);
  if (!info) return;

  const p = await prisma.pendingRequest.findUnique({ where:{ id: info.id } });
  if (!p) return interaction.reply({ content:'This offer has expired.', ephemeral:true });
  if (interaction.user.id !== p.subId) return interaction.reply({ content:'Only the addressed sub may respond.', ephemeral:true });

  if (info.action === 'decline') {
    await prisma.pendingRequest.delete({ where:{ id: p.id } });
    return interaction.update({ embeds:[gothicEmbed('Offer Declined', 'The parchment is torn in two.', { accent: true })], components: [] });
  }

  // ACCEPT
  if (p.type === 'own') {
    await prisma.relationship.create({ data:{ guildId:p.guildId, domId:p.domId, subId:p.subId, status:'active' } });
  } else if (p.type === 'protect') {
    await prisma.consent.upsert({
      where:{ id:`${p.guildId}-${p.subId}` },
      update:{ limits:'PROTECTED' },
      create:{ id:`${p.guildId}-${p.subId}`, guildId:p.guildId, userId:p.subId, limits:'PROTECTED' }
    } as any);
  } else if (p.type === 'contract') {
    await prisma.contract.create({
      data:{ guildId:p.guildId, domId:p.domId, subId:p.subId, terms:(JSON.parse(p.payload||'{}').terms||''), status:'active' }
    });
  } else if (p.type === 'consider') {
    await prisma.relationship.create({
      data:{ guildId:p.guildId, domId:p.domId, subId:p.subId, status:'consider' }
    });
  }

  await prisma.pendingRequest.delete({ where:{ id: p.id } });
  return interaction.update({ embeds:[gothicEmbed('Offer Accepted', 'It is sealed in ink.')], components: [] });
}
