
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
    @bot.tree.command(name="bratjail", description="Harsher jail; mistakes add to total and case rerandomizes.")
    @app_commands.describe(sub="Submissive", sentence="The sentence they must type", times="How many times")
    async def bratjail(i: Interaction, sub: discord.User, sentence: str, times: int):
        member = i.guild.get_member(i.user.id)
        if not await is_domme(member):
            return await i.response.send_message("Only Dommes can use this.", ephemeral=True)
        seed = random.randint(1, 1_000_000_000)
        async with Session() as s:
            s.add(JailSession(id=cuid(), sub_id=sub.id, domme_id=i.user.id, brat=True, sentence_text=sentence, total_needed=times, case_seed=seed))
            await s.commit()
        await i.response.send_message(embed=gothic_embed("Brat Jail", f"**<@{sub.id}>** is in brat jail. Type this exactly **{times}** times (mistakes add 1 to total):\n\n`{random_case(sentence, seed)}`"))
