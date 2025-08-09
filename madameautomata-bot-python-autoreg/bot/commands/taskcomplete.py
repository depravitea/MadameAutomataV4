
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
    @bot.tree.command(name="taskcomplete", description="Mark a task as complete (awaits Domme approval).")
    @app_commands.describe(taskid="Task ID")
    async def taskcomplete(i: Interaction, taskid: str):
        async with Session() as s:
            t = await s.get(Task, taskid)
            if not t:
                return await i.response.send_message("Task not found.", ephemeral=True)
            if t.assignee_id != i.user.id:
                return await i.response.send_message("This isn't your task.", ephemeral=True)
            t.completed = True
            await s.commit()

        view = discord.ui.View()
        async def approve_cb(interaction: discord.Interaction):
            async with Session() as s:
                t2 = await s.get(Task, taskid)
                if interaction.user.id != t2.owner_id:
                    return await interaction.response.send_message("Only the assigning Domme can approve.", ephemeral=True)
                t2.approved = True
                await s.commit()
            await interaction.response.edit_message(embed=gothic_embed("Task Approved", f"Task **{t2.title}** approved."), view=None)

        async def revise_cb(interaction: discord.Interaction):
            async with Session() as s:
                t2 = await s.get(Task, taskid)
                if interaction.user.id != t2.owner_id:
                    return await interaction.response.send_message("Only the assigning Domme can request revision.", ephemeral=True)
                t2.completed = False
                t2.approved = False
                await s.commit()
            await interaction.response.edit_message(embed=gothic_embed("Revision Requested", f"Task **{t2.title}** needs revision."), view=None)

        view.add_item(discord.ui.Button(label="Approve ✅", style=discord.ButtonStyle.success, callback=approve_cb))
        view.add_item(discord.ui.Button(label="Request Revision ✎", style=discord.ButtonStyle.secondary, callback=revise_cb))

        await i.response.send_message(embed=gothic_embed("Task Submitted", f"Task **{t.title}** submitted for approval by <@{t.owner_id}>."), view=view)
