
// Crimson Peak × Nosferatu aesthetic
export const Theme = {
  colors: {
    primary: 0x4b0f1a,   // velvet crimson
    secondary: 0x2e1a21, // dark wine
    accent: 0xd4b998,    // parchment gold
    success: 0x1f6f43,
    danger:  0x7a0a2a,
    info:    0x4d3a3a
  },
  art: {
    header: "⍣︶꒦꒷⍣☾ 𝕄𝔄𝔇𝔄𝔐𝔈 𝔄𝔘𝔗𝔒𝔐𝔄𝔗𝔄 ☽⍣꒷꒦︶⍣",
    footer: "⟢ crimson peak × nosferatu ⟣",
    divider: "┈┈┈┈┈┈┈┈┈┈",
    watermark: "🦇",
    bannerUrl: "https://discord.com/channels/1126720995479261256/1404579157496827985/1404579184742891522"
  }
};

export function gothicEmbed(title = "", description = "") {
  return {
    color: Theme.colors.primary,
    title: `${Theme.art.header}
${title}`.trim(),
    description: description || Theme.art.divider,
    image: { url: Theme.art.bannerUrl },
    footer: { text: Theme.art.footer }
  };
}
