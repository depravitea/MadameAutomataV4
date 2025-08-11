// src/theme/theme.js
// Global look + per-command variants for easy editing later.
// Edit URLs, colors, headers, footers here and redeploy.

const hexToInt = (hex) => parseInt(String(hex).replace(/^#/, ""), 16);

// ---------- GLOBAL DEFAULTS (used if a variant doesn't override) ----------
export const GlobalTheme = {
  color: hexToInt("#4b0f1a"), // crimson velvet
  header: "⍣︶꒦꒷⍣☾ 𝕄𝔄𝔇𝔄𝕄𝔈 𝔄𝕌𝕋𝕆𝕄𝔄𝕋𝔄 ☽⍣꒷꒦︶⍣",
  footer: "⟢ crimson peak × nosferatu ⟣",
  divider: "┈┈┈┈┈┈┈┈┈┈",
  bannerUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80&auto=format&fit=crop",
  thumbnailUrl: "",
  author: { name: "Madame Automata", iconUrl: "", url: "" },
  footerIconUrl: "", // optional icon left of footer
  timestamp: true
};
// -------------------------------------------------------------------------

// ---------- PER-COMMAND VARIANTS (EDIT THESE FREELY) ----------------------
export const Variants = {
  // Collars / Consent
  collar: {
    color: hexToInt("#7a0a2a"),
    header: "♱ Collar Rite ♱",
    footer: "consent etched in velvet",
    bannerUrl: "https://images.unsplash.com/photo-1505483531331-0160a1f3fe5e?w=1600&q=80&auto=format&fit=crop"
  },
  release: {
    color: hexToInt("#1f6f43"),
    header: "🗝 Release",
    footer: "keys turned with care",
    bannerUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80&auto=format&fit=crop"
  },
  red: {
    color: hexToInt("#b1002e"),
    header: "RED ALERT",
    footer: "safety first, always",
    bannerUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80&auto=format&fit=crop"
  },

  // Profiles
  domprofile: {
    color: hexToInt("#7e2c3b"),
    header: "👑 Domme Profile",
    footer: "authority, curated",
    bannerUrl: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1600&q=80&auto=format&fit=crop"
  },
  subprofile: {
    color: hexToInt("#3b1f25"),
    header: "🩸 Sub Profile",
    footer: "devotion on display",
    bannerUrl: "https://images.unsplash.com/photo-1510130387422-82bed34b37e3?w=1600&q=80&auto=format&fit=crop"
  },

  // Chastity
  cage: {
    color: hexToInt("#2e1a21"),
    header: "⛓ Chastity Decree ⛓",
    footer: "time is the lock",
    bannerUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1600&q=80&auto=format&fit=crop"
  },
  caged: {
    color: hexToInt("#4d3a3a"),
    header: "⛓ Currently Caged",
    footer: "tick… tock…",
    bannerUrl: "https://images.unsplash.com/photo-1491349174775-aaafddd81942?w=1600&q=80&auto=format&fit=crop"
  },

  // Discipline
  jail: {
    color: hexToInt("#4d3a3a"),
    header: "🕯 Penitence Hall 🕯",
    footer: "scripture by repetition",
    bannerUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1600&q=80&auto=format&fit=crop"
  },
  bratjail: {
    color: hexToInt("#6b1b2a"),
    header: "🕯 Brat Wing 🕯",
    footer: "mistakes tithe interest",
    bannerUrl: "https://images.unsplash.com/photo-1515165562835-c3b8b0e221e5?w=1600&q=80&auto=format&fit=crop"
  },
  punish: {
    color: hexToInt("#5a0f1f"),
    header: "⚖ Punishment",
    footer: "measured and meaningful",
    bannerUrl: "https://images.unsplash.com/photo-1508349937151-22b68b72d5b5?w=1600&q=80&auto=format&fit=crop"
  },

  // Stars
  star: {
    color: hexToInt("#d4b998"),
    header: "✶ Stars",
    footer: "merit and mischief",
    bannerUrl: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=1600&q=80&auto=format&fit=crop"
  },
  starchart: {
    color: hexToInt("#d4b998"),
    header: "✶ Starchart — All Time",
    footer: "constellations of devotion",
    bannerUrl: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1600&q=80&auto=format&fit=crop"
  },

  // Tasks
  task: {
    color: hexToInt("#59303a"),
    header: "📜 Task Ledger",
    footer: "obedience, itemized",
    bannerUrl: "https://images.unsplash.com/photo-1497215728101-495988d4959b?w=1600&q=80&auto=format&fit=crop"
  },
  taskcomplete: {
    color: hexToInt("#1f6f43"),
    header: "✔ Task Signed Off",
    footer: "well done",
    bannerUrl: "https://images.unsplash.com/photo-1518085250887-2f903c200fee?w=1600&q=80&auto=format&fit=crop"
  },

  // Worship
  worship: {
    color: hexToInt("#2a1318"),
    header: "🕯 Worship",
    footer: "hushed and honeyed",
    bannerUrl: "https://images.unsplash.com/photo-1519681399051-13b8f9c3b3f2?w=1600&q=80&auto=format&fit=crop"
  },

  // Setup / Admin
  setup: {
    color: hexToInt("#3a2a2a"),
    header: "⚙ Setup",
    footer: "config in candlelight",
    bannerUrl: "https://images.unsplash.com/photo-1526312426976-593c2c7f0bb1?w=1600&q=80&auto=format&fit=crop"
  }
};
// -------------------------------------------------------------------------

// Back-compat alias (some files import { Theme })
export const Theme = GlobalTheme;

/**
 * Build an embed. Pass { variant: "collar" } etc. to use a command theme.
 * You can also override any property inline (color, bannerUrl, header, footer…).
 */
export function gothicEmbed(title = "", description = "", overrides = {}) {
  const v = overrides.variant && Variants[overrides.variant] ? Variants[overrides.variant] : null;
  const t = { ...GlobalTheme, ...(v || {}), ...overrides };

  const embed = {
    color: t.color,
    title: [t.header, title].filter(Boolean).join("\n"),
    description: description || t.divider,
    footer: t.footer
      ? (t.footerIconUrl ? { text: t.footer, icon_url: t.footerIconUrl } : { text: t.footer })
      : undefined,
    image: t.bannerUrl ? { url: t.bannerUrl } : undefined,
    thumbnail: t.thumbnailUrl ? { url: t.thumbnailUrl } : undefined,
    author: t.author?.name
      ? { name: t.author.name, icon_url: t.author.iconUrl || undefined, url: t.author.url || undefined }
      : undefined
  };
  if (t.timestamp) embed.timestamp = new Date();
  return embed;
}

// Optional: tweak global defaults at runtime
export const setGlobalTheme = (partial) => Object.assign(GlobalTheme, partial);
export const hex = hexToInt;
