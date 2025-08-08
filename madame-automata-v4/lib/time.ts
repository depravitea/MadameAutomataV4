import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
dayjs.extend(utc); dayjs.extend(timezone);

const TZ = process.env.TIMEZONE || 'UTC';
export const now = () => dayjs().tz(TZ);
export const parseInput = (s: string) => {
  const a = dayjs.tz(s, TZ);
  if (a.isValid()) return a;
  const b = dayjs.tz(s, 'YYYY-MM-DD HH:mm', TZ);
  return b.isValid() ? b : null;
};
export const toDiscordTs = (d: Date, fmt: 't'|'T'|'d'|'D'|'f'|'F'|'R'='f') =>
  `<t:${Math.floor(d.getTime()/1000)}:${fmt}>`;
