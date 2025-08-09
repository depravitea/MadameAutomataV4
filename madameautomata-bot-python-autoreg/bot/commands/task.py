import discord
from discord import app_commands, Interaction
from ..theme import gothic_embed
from ..util.perm import is_domme
from ..db import Session, Task, Config
from ..util.ids import cuid
from datetime import datetime, timedelta
import re

def setup(bot: discord.Client):
    @bot.tree.command(
        name="task",
        description="Assign a task to a sub or blast to the @taskslut role (leave sub empty)."
    )
    @app_commands.describe(
        sub="Assignee (leave empty to blast to @taskslut)",
        title="Short title",
        details="Details / checklist",
        deadline="Relative time (e.g., 12h or 2d)"
    )
    async def task(
        i: Interaction,
        sub: discord.User | None = None,
        title: str = "",
        details: str | None = None,
        deadline: str | None = None
    ):
        # Permission: Dommes only
        member = i.guild.get_member(i.user.id) if i.guild else None
        if not await is_domme(member):
            return await i.response.send_message("Only Dommes can use this.", ephemeral=True)

        # Parse optional relative deadline
        due_at: datetime | None = None
        if deadline:
            m = re.fullmatch(r'(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?', deadline.strip(), re.I)
            if m:
                d, h, mi = (int(x) if x else 0 for x in m.groups())
                secs = (((d * 24 + h) * 60) + mi) * 60
                if secs > 0:
                    due_at = datetime.utcnow() + timedelta(seconds=secs)

        # Single‑sub assignment
        if sub is not None:
            async with Session() as s:
                t = Task(
                    id=cuid(),
                    owner_id=str(i.user.id),
                    assignee_id=str(sub.id),
                    title=title,
                    details=details,
                    due_at=due_at
                )
                s.add(t)
                await s.commit()
                task_id = t.id

            # DM the sub with Accept button
            view = discord.ui.View(timeout=600)

            async def accept_cb(interaction: discord.Interaction, _task_id=task_id, _sub_id=sub.id, _title=title):
                if interaction.user.id != _sub_id:
                    return await interaction.response.send_message("Only the assignee can accept.", ephemeral=True)
                async with Session() as s:
                    tt = await s.get(Task, _task_id)
                    if tt:
                        tt.accepted = True
                        await s.commit()
                await interaction.response.edit_message(
                    embed=gothic_embed("Task Accepted", f"Task **{_title}** accepted by <@{_sub_id}>."),
                    view=None
                )

            btn = discord.ui.Button(label="Accept Task", style=discord.ButtonStyle.success)
            btn.callback = accept_cb
            view.add_item(btn)

            body = f"**<@{sub.id}>** {title}\n{details or ''}"
            if due_at:
                body += f"\nDue: <t:{int(due_at.timestamp())}:R>"

            # Try DM; if blocked, post in-channel
            try:
                dm = await sub.create_dm()
                await dm.send(embed=gothic_embed("Task Assigned", body), view=view)
                await i.response.send_message(
                    embed=gothic_embed("Task Assigned", f"Sent to <@{sub.id}> via DM."), ephemeral=True
                )
            except Exception:
                await i.response.send_message(embed=gothic_embed("Task Assigned", body), view=view)

            return  # end single‑sub path

        # Role‑blast to @taskslut
        # Load config for the TaskSlut role
        async with Session() as s:
            cfg = await s.get(Config, 1)
        if not cfg or not cfg.taskslut_role_id:
            return await i.response.send_message(
                "No TaskSlut role is configured. Run `/setup_set_role key:TaskSlut role:@taskslut` first.",
                ephemeral=True
            )

        role = i.guild.get_role(int(cfg.taskslut_role_id))
        if not role:
            return await i.response.send_message("Configured TaskSlut role not found on this server.", ephemeral=True)

        # Create tasks for each eligible member
        created: list[tuple[int, str]] = []  # (user_id, task_id)
        async with Session() as s:
            for m in role.members:
                if m.bot:
                    continue
                t = Task(
                    id=cuid(),
                    owner_id=str(i.user.id),
                    assignee_id=str(m.id),
                    tit
