
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
    @bot.tree.command(name="subprofile", description="Show or set a Sub profile.")
    @app_commands.describe(petnames="Preferred pet names", about="About me", limits="Limits", user="View another sub")
    async def subprofile(i: Interaction, petnames: str | None = None, about: str | None = None, limits: str | None = None, user: discord.User | None = None):
        target = user or i.user
        async with Session() as s:
            tu = await s.get(User, target.id)
            if target.id == i.user.id and (petnames or about or limits):
                if not tu:
                    tu = User(id=target.id, is_sub=True)
                    s.add(tu)
                tu.is_sub = True
                if petnames is not None: tu.titles = petnames
                if about is not None: tu.about = about
                if limits is not None: tu.limits = limits
                await s.commit()
                return await i.response.send_message("Profile updated.", ephemeral=True)

            # read
            if not tu:
                return await i.response.send_message("No profile yet.", ephemeral=True)
            res = await s.execute(select(Collaring).where(Collaring.sub_id==target.id, Collaring.active==True))
            collars = res.scalars().all()
            collines = []
            for c in collars:
                collines.append(f"{c.type} by <@{c.domme_id}>")
            tasks_done = (await s.execute(select(func.count()).select_from(Task).where(Task.assignee_id==target.id, Task.approved==True))).scalar()
        e = gothic_embed("🩸 Sub Profile", f"**Pet names:** {tu.titles or '—'}\n**About:** {tu.about or '—'}\n**Limits:** {tu.limits or '—'}\n**Collared by:**\n{('\n'.join(collines) or '—')}\n**Completed tasks:** {tasks_done or 0}\n**Dommes released them:** {tu.domme_releases}")
        await i.response.send_message(embed=e)
