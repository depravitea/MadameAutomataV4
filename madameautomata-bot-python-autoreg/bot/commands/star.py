
import discord
from discord import app_commands, Interaction
from ..theme import gothic_embed
from ..util.perm import is_domme, is_staff, is_sub
from ..db import Session, User, Collaring, Cage, JailSession, Star, Task, Worship, Config, CollarType, StarStatus
from ..util.time import parse_duration, random_case
from ..util.ids import cuid
from datetime import datetime, timedelta
from sqlalchemy import select, func, update, and_

async def domme_star_inventory(domme_id: str) -> int:
    async with Session() as s:
        u = await s.get(User, domme_id)
        xp = u.domme_xp if u else 0
        given = (await s.execute(select(func.coalesce(func.sum(Star.amount),0)).where(Star.domme_id==domme_id, Star.amount>0))).scalar()
        taken = (await s.execute(select(func.coalesce(func.sum(Star.amount),0)).where(Star.domme_id==domme_id, Star.amount<0, Star.status==StarStatus.APPROVED))).scalar()
        stars_from_xp = xp // 50
        used = (given or 0) + (taken or 0)
        return stars_from_xp - used

def setup(bot):
    @bot.tree.command(name="star", description="Give/take stars for subs, or view inventory")
    @app_commands.describe(action="give/take/inventory", sub="Submissive", reason="Reason")
    @app_commands.choices(action=[
        app_commands.Choice(name="give", value="give"),
        app_commands.Choice(name="take", value="take"),
        app_commands.Choice(name="inventory", value="inventory"),
    ])
    async def star(i: Interaction, action: app_commands.Choice[str], sub: discord.User | None = None, reason: str | None = None):
        if action.value == "inventory":
            inv = await domme_star_inventory(i.user.id)
            return await i.response.send_message(embed=gothic_embed("Star Inventory", f"You can give **{inv}** stars."), ephemeral=True)
        member = i.guild.get_member(i.user.id)
        if not await is_domme(member):
            return await i.response.send_message("Only Dommes can use this.", ephemeral=True)
        if not sub:
            return await i.response.send_message("Pick a sub.", ephemeral=True)
        async with Session() as s:
            if action.value == "give":
                inv = await domme_star_inventory(i.user.id)
                if inv <= 0:
                    return await i.response.send_message("You have no stars left to give.", ephemeral=True)
                s.add(Star(id=cuid(), domme_id=i.user.id, sub_id=sub.id, amount=1, reason=reason, status=StarStatus.APPROVED))
                await s.commit()
                return await i.response.send_message(embed=gothic_embed("Star Given", f"You gave a ⭐ to <@{sub.id}>."))
            else:
                s.add(Star(id=cuid(), domme_id=i.user.id, sub_id=sub.id, amount=-1, reason=reason, status=StarStatus.PENDING))
                await s.commit()
                return await i.response.send_message(embed=gothic_embed("Star Removal Requested", f"Removal request for <@{sub.id}> sent to staff."))
