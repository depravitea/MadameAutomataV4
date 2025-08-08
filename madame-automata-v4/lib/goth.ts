import { EmbedBuilder, InteractionReplyOptions } from 'discord.js';
import { theme } from './theme.js';

const titleFrame = (t: string) => `༺ ${theme.ornament} ${t} ${theme.ornament} ༻`;

export function gothicEmbed(
  title: string,
  description?: string,
  opts?: { accent?: boolean; fields?: { name: string; value: string; inline?: boolean }[] }
) {
  const e = new EmbedBuilder()
    .setTitle(titleFrame(title))
    .setDescription(description || '')
    .setColor(parseInt((opts?.accent ? theme.accent : theme.primary).replace('#',''), 16));
  if (theme.thumbnail) e.setThumbnail(theme.thumbnail);
  if (theme.banner)    e.setImage(theme.banner);
  if (theme.footer?.trim()) e.setFooter({ text: theme.footer });
  if (opts?.fields?.length) e.addFields(opts.fields);
  return e;
}

export const M = {
  user: (id: string) => `<@${id}>`,
  role: (id: string) => `<@&${id}>`,
  channel: (id: string) => `<#${id}>`
};

export const speak = {
  ok:     (t: string, d?: string, fields?: any[]) => gothicEmbed(t, d, { fields }),
  warn:   (t: string, d?: string, fields?: any[]) => gothicEmbed(t, d, { accent: true, fields }),
  modlog: (t: string, d?: string, fields?: any[]) => gothicEmbed(t, d, { fields })
};

export async function say(i: any, opts: {
  title: string; description?: string; fields?: { name: string; value: string; inline?: boolean }[];
  pingUserId?: string | null; accent?: boolean; ephemeral?: boolean;
}) {
  const embed = gothicEmbed(opts.title, opts.description, { accent: !!opts.accent, fields: opts.fields });
  const payload: InteractionReplyOptions = {
    embeds: [embed],
    ephemeral: !!opts.ephemeral
  };
  if (opts.pingUserId) {
    payload.content = `<@${opts.pingUserId}>`;
    payload.allowedMentions = { users: [opts.pingUserId] };
  }
  return i.reply(payload);
}
