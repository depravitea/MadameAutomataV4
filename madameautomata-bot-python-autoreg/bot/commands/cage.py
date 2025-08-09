
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
    @bot.tree.command(name="cage", description="Lock a submissive in a chastity timer.")
    @app_commands.describe(sub="Submissive", time="e.g., 1d12h30m")
    async def cage(i: Interaction, sub: discord.User, time: str):
        if not await is_domme(i.user if isinstance(i.user, discord.Member) else i.guild.get_member(i.user.id)):
            return await i.response.send_message("Only Dommes can use this.", ephemeral=True)
        try:
            ms = parse_duration(time)
        except:
            return await i.response.send_message("Invalid duration. Try `1d12h30m`.", ephemeral=True)
        ends = datetime.utcnow() + timedelta(milliseconds=ms)
        async with Session() as s:
            # upsert users
            u = await s.get(User, sub.id)
            if not u:
                u = User(id=sub.id, is_sub=True)
                s.add(u)
            else:
                u.is_sub = True
            d = await s.get(User, i.user.id)
            if not d:
                d = User(id=i.user.id, is_domme=True)
                s.add(d)
            else:
                d.is_domme = True
            s.add(Cage(id=cuid(), sub_id=sub.id, domme_id=i.user.id, ends_at=ends, active=True))
            await s.commit()
        await i.response.send_message(embed=gothic_embed("Chastity Applied", f"**<@{sub.id}>** is now caged until <t:{int(ends.timestamp())}:f>\n{time} total."))
