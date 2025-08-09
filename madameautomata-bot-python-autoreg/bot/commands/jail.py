
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
    @bot.tree.command(name="jail", description="Jail a submissive; they must type a sentence N times.")
    @app_commands.describe(sub="Submissive", sentence="The sentence they must type", times="How many times")
    async def jail(i: Interaction, sub: discord.User, sentence: str, times: int):
        member = i.guild.get_member(i.user.id)
        if not await is_domme(member):
            return await i.response.send_message("Only Dommes can use this.", ephemeral=True)
        seed = random.randint(1, 1_000_000_000)
        async with Session() as s:
            s.add(JailSession(id=cuid(), sub_id=sub.id, domme_id=i.user.id, brat=False, sentence_text=sentence, total_needed=times, case_seed=seed))
            await s.commit()
        await i.response.send_message(embed=gothic_embed("Jail", f"**<@{sub.id}>** is jailed. Type this exactly **{times}** times in the jail channel:\n\n`{random_case(sentence, seed)}`"))
