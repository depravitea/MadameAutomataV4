// src/theme/theme.js
// A dead-simple global theme you can edit in one place.
// Every embed will use these defaults unless you override in a command call.

const hexToInt = (hex) => parseInt(String(hex).replace(/^#/, ""), 16);

// ---- EDIT THESE VALUES TO TEST YOUR LOOK -----------------------------------
export const GlobalTheme = {
  color: hexToInt("#4b0f1a"), // crimson velvet accent bar
  header: "⍣︶꒦꒷⍣☾ 𝐌𝐚𝐝𝐚𝐦𝐞 𝐀𝐮𝐭𝐨𝐦𝐚𝐭𝐚 ☽⍣꒷꒦︶⍣",
  footer: "⟢ 𝐹𝜀𝑚𝜕𝜎𝑚 𝐸𝑚𝑝𝑦𝑟𝑒𝑎𝑛 ⟣",
  divider: "test",
  bannerUrl:
    "https://i.imgur.com/DsAzT61.png", // global banner
  thumbnailUrl: "", // optional small square at top-right
  author: {
    name: "Madame Automata",
    iconUrl: "", // optional
    url: "https://i.imgur.com/DsAzT61.png"     // optional
  },
  timestamp: true, // add timestamp to embeds by default
};
// ----------------------------------------------------------------------------

// build a Discord.js-compatible embed object from the global theme + overrides
export function gothicEmbed(title = "", description = "", overrides = {}) {
  const t = { ...GlobalTheme, ...overrides };

  const embed = {
    color: t.color,
    title: [t.header, title].filter(Boolean).join("\n"),
    description: description || t.divider,
    footer: t.footer ? { text: t.footer } : undefined,
    image: t.bannerUrl ? { url: t.bannerUrl } : undefined,
    thumbnail: t.thumbnailUrl ? { url: t.thumbnailUrl } : undefined,
    author: t.author?.name
      ? { name: t.author.name, icon_url: t.author.iconUrl || undefined, url: t.author.url || undefined }
      : undefined,
  };
  if (t.timestamp) embed.timestamp = new Date();
  return embed;
}

// handy helpers if you want to tweak at runtime
export const setGlobalTheme = (partial) => Object.assign(GlobalTheme, partial);
export const hex = hexToInt;
