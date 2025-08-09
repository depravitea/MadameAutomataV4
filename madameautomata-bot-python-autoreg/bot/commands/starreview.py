
import discord
from discord import app_commands, Interaction
from ..theme import gothic_embed
from ..util.perm import is_staff
from ..db import Session, Star, StarStatus
from sqlalchemy import select

def setup(bot):
    @bot.tree.command(name="star_pending", description="List pending star removal requests (staff only).")
    async def star_pending(i: Interaction):
        if not await is_staff(i.guild.get_member(i.user.id)):
            return await i.response.send_message("Staff only.", ephemeral=True)
        async with Session() as s:
            rows = (await s.execute(
                select(Star).where(Star.status==StarStatus.PENDING).order_by(Star.created_at.desc()).limit(20)
            )).scalars().all()
        if not rows:
            return await i.response.send_message(embed=gothic_embed("Pending Star Removals", "None."), ephemeral=True)
        lines = []
        for r in rows:
            lines.append(f"`{r.id}` — domme:<@{r.domme_id}> sub:<@{r.sub_id}> reason: {r.reason or '—'}")
        await i.response.send_message(embed=gothic_embed("Pending Star Removals", "\n".join(lines)), ephemeral=True)

    @bot.tree.command(name="star_decide", description="Approve or deny a pending star removal (staff only).")
    @app_commands.describe(star_id="The ID shown in /star_pending", decision="approve or deny")
    @app_commands.choices(decision=[
        app_commands.Choice(name="approve", value="approve"),
        app_commands.Choice(name="deny", value="deny"),
    ])
    async def star_decide(i: Interaction, star_id: str, decision: app_commands.Choice[str]):
        if not await is_staff(i.guild.get_member(i.user.id)):
            return await i.response.send_message("Staff only.", ephemeral=True)
        async with Session() as s:
            st = await s.get(Star, star_id)
            if not st or st.status != StarStatus.PENDING:
                return await i.response.send_message("No such pending request.", ephemeral=True)
            st.status = StarStatus.APPROVED if decision.value == "approve" else StarStatus.DENIED
            await s.commit()
        await i.response.send_message(embed=gothic_embed("Star Removal", f"{decision.value.title()}d request `{star_id}` for <@{st.sub_id}> (by <@{st.domme_id}>)."), ephemeral=True)
