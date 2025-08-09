
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
    @bot.tree.command(name="starchart", description="Star leaderboards (all-time)")
    async def starchart(i: Interaction):
        async with Session() as s:
            rows = (await s.execute(
                select(Star.sub_id, func.coalesce(func.sum(Star.amount),0))
                .where(Star.status==StarStatus.APPROVED)
                .group_by(Star.sub_id)
                .order_by(func.sum(Star.amount).desc())
                .limit(10)
            )).all()
        if not rows:
            return await i.response.send_message(embed=gothic_embed("All-Time Starchart", "—"))
        lines = [f"**{idx+1}.** <@{sid}> — {amt} ⭐" for idx,(sid,amt) in enumerate(rows)]
        await i.response.send_message(embed=gothic_embed("All-Time Starchart", "\n".join(lines)))
