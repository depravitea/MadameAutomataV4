
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
    @bot.tree.command(name="release", description="Release a user from collar, chastity, or jail.")
    @app_commands.describe(user="Target", what="What to release")
    @app_commands.choices(what=[
        app_commands.Choice(name="Collar", value="collar"),
        app_commands.Choice(name="Chastity", value="chastity"),
        app_commands.Choice(name="Jail", value="jail"),
        app_commands.Choice(name="Brat Jail", value="bratjail"),
    ])
    async def release(i: Interaction, user: discord.User, what: app_commands.Choice[str]):
        member = i.guild.get_member(i.user.id)
        if not await is_domme(member):
            return await i.response.send_message("Only Dommes can use this.", ephemeral=True)
        async with Session() as s:
            if what.value == "collar":
                res = await s.execute(select(Collaring).where(Collaring.sub_id==user.id, Collaring.domme_id==i.user.id, Collaring.active==True))
                active = res.scalars().first()
                if not active:
                    return await i.response.send_message("You don't have an active collar on this sub.", ephemeral=True)
                active.active = False
                active.ended_at = datetime.utcnow()
                u = await s.get(User, user.id)
                if u:
                    u.domme_releases += 1
                await s.commit()
                return await i.response.send_message(embed=gothic_embed("Collar Released", f"Released <@{user.id}>."))
            if what.value == "chastity":
                await s.execute(update(Cage).where(Cage.sub_id==user.id, Cage.domme_id==i.user.id, Cage.active==True).values(active=False))
                await s.commit()
                return await i.response.send_message(embed=gothic_embed("Chastity Released", f"Released <@{user.id}> from chastity."))
            if what.value in ("jail","bratjail"):
                await s.execute(update(JailSession).where(JailSession.sub_id==user.id, JailSession.active==True).values(active=False))
                await s.commit()
                return await i.response.send_message(embed=gothic_embed("Jail Released", f"Released <@{user.id}> from jail."))
