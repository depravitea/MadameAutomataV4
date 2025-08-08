import type { Client } from 'discord.js';

export function startReminders(client: Client){
  // No-op fallback so builds succeed even if you don't want reminders yet.
  // You can replace this with the full reminders job later.
  setInterval(()=>{
    // keep-alive tick
  }, 60_000);
}
