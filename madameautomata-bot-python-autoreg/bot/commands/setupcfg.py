
import discord
from discord import app_commands, Interaction
from ..theme import gothic_embed
from ..util.perm import is_domme, is_staff, is_sub
from ..db import Session, User, Collaring, Cage, JailSession, Star, Task, Worship, Config, CollarType, StarStatus
from ..util.time import parse_duration, random_case
from ..util.ids import cuid
from datetime import datetime, timedelta
from sqlalchemy import select, func, update, and_

from discord import app_commands, Interaction, ChannelType, Permissions

def setup(bot):
    @bot.tree.command(name="setup", description="Configure role and channel IDs (admin only).")
    @app_commands.default_permissions(manage_guild=True)
    async def setup(i: Interaction):
        await i.response.send_message("Use subcommands: /setup_set_role or /setup_set_channel or /setup_show", ephemeral=True)

    @bot.tree.command(name="setup_set_role", description="Set a role mapping (admin).")
    @app_commands.default_permissions(manage_guild=True)
    @app_commands.describe(key="Which role", role="Role to use")
    @app_commands.choices(key=[
        app_commands.Choice(name="Domme", value="domme_role_id"),
        app_commands.Choice(name="Sub", value="sub_role_id"),
        app_commands.Choice(name="TaskSlut", value="taskslut_role_id"),
        app_commands.Choice(name="WorshipMe", value="worshipme_role_id"),
        app_commands.Choice(name="Staff", value="staff_role_id"),
    ])
    async def setup_set_role(i: Interaction, key: app_commands.Choice[str], role: discord.Role):
        async with Session() as s:
            cfg = await s.get(Config, 1)
            if not cfg:
                from ..db import Config as Cfg
                cfg = Cfg(id=1)
                s.add(cfg)
            setattr(cfg, key.value, str(role.id))
            await s.commit()
        await i.response.send_message(embed=gothic_embed("Setup", f"Saved **{key.value}** → <@&{role.id}>"), ephemeral=True)

    @bot.tree.command(name="setup_set_channel", description="Set a channel mapping (admin).")
    @app_commands.default_permissions(manage_guild=True)
    @app_commands.describe(key="Which channel", channel="Channel to use")
    @app_commands.choices(key=[
        app_commands.Choice(name="Jail", value="jail_channel_id"),
        app_commands.Choice(name="BratJail", value="bratjail_channel_id"),
        app_commands.Choice(name="Worship", value="worship_channel_id"),
        app_commands.Choice(name="StaffAlerts", value="staff_alerts_channel_id"),
    ])
    async def setup_set_channel(i: Interaction, key: app_commands.Choice[str], channel: discord.TextChannel):
        async with Session() as s:
            cfg = await s.get(Config, 1)
            if not cfg:
                from ..db import Config as Cfg
                cfg = Cfg(id=1)
                s.add(cfg)
            setattr(cfg, key.value, str(channel.id))
            await s.commit()
        await i.response.send_message(embed=gothic_embed("Setup", f"Saved **{key.value}** → <#{channel.id}>"), ephemeral=True)

    @bot.tree.command(name="setup_show", description="Show current config")
    @app_commands.default_permissions(manage_guild=True)
    async def setup_show(i: Interaction):
        async with Session() as s:
            cfg = await s.get(Config, 1)
        if not cfg:
            return await i.response.send_message("No config saved yet.", ephemeral=True)
        lines = []
        for k in ["domme_role_id","sub_role_id","taskslut_role_id","worshipme_role_id","staff_role_id","jail_channel_id","bratjail_channel_id","worship_channel_id","staff_alerts_channel_id"]:
            v = getattr(cfg, k)
            lines.append(f"• **{k}**: {v or '—'}")
        await i.response.send_message(embed=gothic_embed("Current Config", "\n".join(lines)), ephemeral=True)
