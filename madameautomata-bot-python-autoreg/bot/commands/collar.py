
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
    @bot.tree.command(name="collar", description="Collar a submissive with consent flow.")
    @app_commands.describe(sub="Submissive")
    async def collar(i: Interaction, sub: discord.User):
        member = i.guild.get_member(i.user.id)
        if not await is_domme(member):
            return await i.response.send_message("Only Dommes can use this.", ephemeral=True)

        view = discord.ui.View(timeout=120)
        select = discord.ui.Select(placeholder="Select collar type", options=[
            discord.SelectOption(label="Consideration Collar", value="CONSIDERATION", description="A trial period—serious, but not permanent."),
            discord.SelectOption(label="Training Collar", value="TRAINING", description="Active shaping and obedience expectations."),
            discord.SelectOption(label="Permanent Collar", value="PERMANENT", description="Lifetime devotion and duty."),
        ])
        choice = {"value": None}

        async def on_select(interaction: discord.Interaction):
            choice["value"] = interaction.data["values"][0]
            await interaction.response.defer()

        select.callback = on_select
        view.add_item(select)
        await i.response.send_message(embed=gothic_embed("Collar Selection", f"Choose a collar for **<@{sub.id}>**."), view=view)
        timed_out = await view.wait()
        if not choice["value"]:
            return

        # Consent buttons
        accept_view = discord.ui.View(timeout=120)
        async def accept_cb(interaction: discord.Interaction):
            if interaction.user.id != sub.id:
                return await interaction.response.send_message("Only the sub can accept/decline.", ephemeral=True)
            async with Session() as s:
                # upsert users
                u = await s.get(User, sub.id)
                if not u:
                    u = User(id=sub.id, is_sub=True)
                    s.add(u)
                else:
                    u.is_sub = True
                d = await s.get(User, i.user.id)
                if not d:
                    d = User(id=i.user.id, is_domme=True)
                    s.add(d)
                else:
                    d.is_domme = True
                s.add(Collaring(id=cuid(), domme_id=i.user.id, sub_id=sub.id, type=CollarType(choice["value"]), active=True))
                await s.commit()
            await interaction.response.edit_message(embed=gothic_embed("Collar Accepted", f"<@{sub.id}> is now collared by <@{i.user.id}>."), view=None)

        async def decline_cb(interaction: discord.Interaction):
            if interaction.user.id != sub.id:
                return await interaction.response.send_message("Only the sub can accept/decline.", ephemeral=True)
            await interaction.response.edit_message(embed=gothic_embed("Collar Declined", f"<@{sub.id}> declined the collar."), view=None)

        accept_view.add_item(discord.ui.Button(label="Accept", style=discord.ButtonStyle.success, custom_id="accept"))
        accept_view.add_item(discord.ui.Button(label="Decline", style=discord.ButtonStyle.danger, custom_id="decline"))

        # map callbacks
        for item in accept_view.children:
            if isinstance(item, discord.ui.Button) and item.custom_id=="accept":
                item.callback = accept_cb
            if isinstance(item, discord.ui.Button) and item.custom_id=="decline":
                item.callback = decline_cb

        await i.followup.send(embed=gothic_embed("Consent Required", f"**<@{sub.id}>**, do you accept the **{choice['value'].title()}** collar from **<@{i.user.id}>**?"), view=accept_view)
