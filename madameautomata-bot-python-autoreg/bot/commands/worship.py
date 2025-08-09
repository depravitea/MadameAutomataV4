
import discord
from discord import app_commands, Interaction
from ..theme import gothic_embed
from ..util.perm import is_domme, is_staff, is_sub
from ..db import Session, User, Collaring, Cage, JailSession, Star, Task, Worship, Config, CollarType, StarStatus
from ..util.time import parse_duration, random_case
from ..util.ids import cuid
from datetime import datetime, timedelta
from sqlalchemy import select, func, update, and_

def setup(bot):
    @bot.tree.command(name="worship", description="Offer worship to the Worship Me role or a Domme.")
    @app_commands.describe(domme="Domme to worship", text="Your worship text")
    async def worship(i: Interaction, text: str, domme: discord.User | None = None):
        async with Session() as s:
            s.add(Worship(id=cuid(), sub_id=i.user.id, domme_id=(domme.id if domme else None), content=text))
            cfg = await s.get(Config, 1)
            await s.commit()
        e = gothic_embed("Worship", f"**<@{i.user.id}>** whispers:\n> {text}\n\n{f'For <@{domme.id}>' if domme else ''}")
        if cfg and cfg.worship_channel_id:
            ch = i.guild.get_channel(int(cfg.worship_channel_id))
            if ch and hasattr(ch, "send"):
                await ch.send(embed=e)
                return await i.response.send_message("Offered.", ephemeral=True)
        await i.response.send_message(embed=e)
