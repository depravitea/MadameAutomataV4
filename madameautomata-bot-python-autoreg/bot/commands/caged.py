
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
    @bot.tree.command(name="caged", description="Show all currently caged submissives.")
    async def caged(i: Interaction):
        async with Session() as s:
            result = await s.execute(select(Cage).where(Cage.active==True))
            rows = result.scalars().all()
        if not rows:
            return await i.response.send_message("No one is currently caged.", ephemeral=True)
        lines = [f"• <@{r.sub_id}> until <t:{int(r.ends_at.timestamp())}:R>" for r in rows]
        await i.response.send_message(embed=gothic_embed("Currently Caged", "\n".join(lines)))
