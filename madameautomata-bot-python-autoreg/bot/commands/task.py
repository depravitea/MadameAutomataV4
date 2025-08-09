
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
    @bot.tree.command(name="task", description="Assign a task to a sub (role-wide TBD).")
    @app_commands.describe(sub="Assignee (pick a sub)", title="Short title", details="Details / checklist", deadline="Relative time like 12h or 2d")
    async def task(i: Interaction, sub: discord.User | None, title: str, details: str | None = None, deadline: str | None = None):
        member = i.guild.get_member(i.user.id)
        if not await is_domme(member):
            return await i.response.send_message("Only Dommes can use this.", ephemeral=True)

        due_at = None
        if deadline:
            import re, time
            m = re.fullmatch(r'(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?', deadline.strip(), re.I)
            if m:
                d,h,mi = (int(x) if x else 0 for x in m.groups())
                secs = (((d*24 + h)*60) + mi)*60
                if secs>0:
                    from datetime import datetime, timedelta
                    due_at = datetime.utcnow() + timedelta(seconds=secs)


if sub is None:
    # Role-wide blast to @taskslut
    async with Session() as s:
        cfg = await s.get(Config, 1)
    if not cfg or not cfg.taskslut_role_id:
        return await i.response.send_message("No TaskSlut role configured. Use /setup_set_role key:TaskSlut first.", ephemeral=True)
    role = i.guild.get_role(int(cfg.taskslut_role_id))
    if not role:
        return await i.response.send_message("TaskSlut role ID is invalid in this server.", ephemeral=True)
    members = [m for m in role.members if not m.bot]
    if not members:
        return await i.response.send_message("No human members have the TaskSlut role.", ephemeral=True)

    created = []
    async with Session() as s:
        for m in members:
            t = Task(id=cuid(), owner_id=i.user.id, assignee_id=str(m.id), title=title, details=details, due_at=due_at)
            s.add(t)
            created.append(t)
        await s.commit()

    # DM each sub a task with an Accept button
    accepted_count = 0
    for t in created:
        try:
            user = await i.client.fetch_user(int(t.assignee_id))
            view = discord.ui.View()
            async def make_cb(tid):
                async def accept_cb(interaction: discord.Interaction):
                    if interaction.user.id != int(t.assignee_id):
                        return await interaction.response.send_message("Only the assignee can accept.", ephemeral=True)
                    async with Session() as s2:
                        tt = await s2.get(Task, tid)
                        tt.accepted = True
                        await s2.commit()
                    await interaction.response.edit_message(embed=gothic_embed("Task Accepted", f"Task **{title}** accepted."), view=None)
                return accept_cb
            btn = discord.ui.Button(label="Accept Task", style=discord.ButtonStyle.success)
            btn.callback = await make_cb(t.id)
            view.add_item(btn)
            body = f"You were assigned: **{title}**\n{details or ''}"
            if due_at:
                body += f"\nDue: <t:{int(due_at.timestamp())}:R>"
            await user.send(embed=gothic_embed("New Task", body), view=view)
        except Exception:
            pass

    # Announce in channel & ping role
    announce = f"Assigned **{len(created)}** tasks to {role.mention}. Each sub received a DM with an Accept button."
    await i.response.send_message(embed=gothic_embed("Task Blast", announce))
    return

        async with Session() as s:
            t = Task(id=cuid(), owner_id=i.user.id, assignee_id=sub.id, title=title, details=details, due_at=due_at)
            s.add(t)
            await s.commit()
            task_id = t.id

        view = discord.ui.View()
        async def accept_cb(interaction: discord.Interaction):
            if interaction.user.id != sub.id:
                return await interaction.response.send_message("Only the assignee can accept.", ephemeral=True)
            async with Session() as s:
                tt = await s.get(Task, task_id)
                tt.accepted = True
                await s.commit()
            await interaction.response.edit_message(embed=gothic_embed("Task Accepted", f"Task **{title}** accepted by <@{sub.id}>."), view=None)

        btn = discord.ui.Button(label="Accept Task", style=discord.ButtonStyle.success)
        btn.callback = accept_cb
        view.add_item(btn)

        body = f"**<@{sub.id}>** {title}\n{details or ''}"
        if due_at:
            body += f"\nDue: <t:{int(due_at.timestamp())}:R>"
        await i.response.send_message(embed=gothic_embed("Task Assigned", body), view=view)
