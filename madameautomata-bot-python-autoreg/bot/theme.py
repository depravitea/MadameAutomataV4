
from discord import Embed, Colour

class Theme:
    brand_name = "MadameAutomata"
    # Nosferatu-in-velvet palette
    colors = {
        "primary": 0x3B0008,     # black-cherry velvet
        "secondary": 0x0B0406,   # near-black plum
        "accent": 0x8D6A75,      # dusty rose / old velvet sheen
        "success": 0x2E5E2A,     # muted moss
        "danger":  0x5E1020,     # dried wine
        "info":    0x3A2B32,     # smokey mauve
    }
    art = {
        "header": "⍣︶꒦꒷⍣☾ 𝕄𝔄𝔇𝔄𝔐𝔈 𝔄𝔘𝔗𝔒𝔐𝔄𝔗𝔄 ☽⍣꒷꒦︶⍣",
        "footer": "⟢ nosferatu in velvet ⟣",
        "divider": "┈┈┈┈┈┈┈┈┈┈",
        "watermark": "🦇",
        # Free, moody velvet texture (swap to your own asset when ready)
        "banner_url": "https://images.unsplash.com/photo-1617806118233-18e1dfeb0f1b?q=80&w=1200&auto=format&fit=crop",
    }

def gothic_embed(title: str | None = None, description: str | None = None) -> Embed:
    e = Embed(
        title=(f"{Theme.art['header']}\n{title}" if title else Theme.art["header"]),
        description=description or Theme.art["divider"],
        color=Theme.colors["primary"],
    )
    e.set_image(url=Theme.art["banner_url"])
    e.set_footer(text=Theme.art["footer"])
    return e
