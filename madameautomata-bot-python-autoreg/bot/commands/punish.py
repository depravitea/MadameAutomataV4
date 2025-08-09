
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
    @bot.tree.command(name="punish", description="Issue a punishment to a sub.")
    @app_commands.describe(sub="Submissive", reason="Punishment details")
    async def punish(i: Interaction, sub: discord.User, reason: str):
        member = i.guild.get_member(i.user.id)
        if not await is_domme(member):
            return await i.response.send_message("Only Dommes can use this.", ephemeral=True)
        await i.response.send_message(embed=gothic_embed("Punishment", f"**<@{sub.id}>** You are punished: {reason}"))
