
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
    @bot.tree.command(name="red", description="Emergency release and alert staff.")
    async def red(i: Interaction):
        async with Session() as s:
            await s.execute(update(JailSession).where(JailSession.sub_id==i.user.id, JailSession.active==True).values(active=False))
            await s.execute(update(Cage).where(Cage.sub_id==i.user.id, Cage.active==True).values(active=False))
            await s.commit()
            # staff alerts
            cfg = (await s.get(Config, 1))
        await i.response.send_message(embed=gothic_embed("RED", f"<@{i.user.id}> has called RED. Staff alerted; all punishments paused."), ephemeral=True)
        if cfg and cfg.staff_alerts_channel_id:
            ch = i.guild.get_channel(int(cfg.staff_alerts_channel_id))
            if ch and hasattr(ch, "send"):
                await ch.send(embed=gothic_embed("RED ALERT", f"Attention staff: <@{i.user.id}> called RED."))
