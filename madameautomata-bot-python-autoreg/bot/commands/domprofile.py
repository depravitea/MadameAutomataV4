
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
    @bot.tree.command(name="domprofile", description="Show or set a Domme profile.")
    @app_commands.describe(titles="Preferred titles", about="About me", limits="Limits")
    async def domprofile(i: Interaction, titles: str | None = None, about: str | None = None, limits: str | None = None):
        async with Session() as s:
            me = await s.get(User, i.user.id)
            if titles or about or limits:
                if not me:
                    me = User(id=i.user.id, is_domme=True)
                    s.add(me)
                me.is_domme = True
                if titles is not None: me.titles = titles
                if about is not None: me.about = about
                if limits is not None: me.limits = limits
                await s.commit()
                return await i.response.send_message("Profile updated.", ephemeral=True)

            # read
            if not me:
                return await i.response.send_message("No profile yet. Add one with options.", ephemeral=True)
            # count active collars as domme
            res = await s.execute(select(Collaring).where(Collaring.domme_id==i.user.id, Collaring.active==True))
            count = len(res.scalars().all())
        e = gothic_embed("👑 Domme Profile", f"**Titles:** {me.titles or '—'}\n**About:** {me.about or '—'}\n**Limits:** {me.limits or '—'}\n**Collared currently:** {count}")
        await i.response.send_message(embed=e)
