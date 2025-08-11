
export function parseDuration(input) {
  const m = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i.exec(input?.trim() || "");
  if (!m) throw new Error("Bad duration. Try 1d12h30m");
  const [_, d,h,mi,s] = m;
  const days = Number(d||0), hours = Number(h||0), mins = Number(mi||0), secs = Number(s||0);
  const totalMs = (((days*24 + hours)*60 + mins)*60 + secs) * 1000;
  if (totalMs <= 0) throw new Error("Duration must be > 0");
  return totalMs;
}
export function randomCase(str, seed = 12345) {
  // simple deterministic randomizer
  let x = seed >>> 0;
  const rand = () => (x = (x*1664525 + 1013904223) >>> 0) / 2**32;
  return [...str].map(ch => /[a-z]/i.test(ch) ? (rand()<0.5 ? ch.toUpperCase() : ch.toLowerCase()) : ch).join("");
}
