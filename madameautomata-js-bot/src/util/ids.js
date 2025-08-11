
export function cuid() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i=0;i<24;i++) out += alphabet[Math.floor(Math.random()*alphabet.length)];
  return out;
}
