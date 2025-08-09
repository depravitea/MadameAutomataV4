
import asyncio
import discord
from discord import app_commands, Intents
from discord.ext import tasks
from .config import settings
from .theme import gothic_embed
from .db import engine, Base, Session, Cage
from sqlalchemy import select, update
from datetime import datetime

class MadameBot(discord.Client):
    def __init__(self):
        intents = Intents.default()
        intents.message_content = True
        intents.members = True
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self):
        # Optionally register slash commands on boot
        if settings.register_on_boot:
            if settings.register_global or not settings.guild_id:
                await self.tree.sync()
                print("[register] Synced commands globally")
            else:
                guild = discord.Object(id=int(settings.guild_id))
                await self.tree.sync(guild=guild)
                print(f"[register] Synced commands to guild {settings.guild_id}")
        self.expirer.start()

    @tasks.loop(seconds=60)
    async def expirer(self):
        # expire cages
        async with Session() as s:
            now = datetime.utcnow()
            result = await s.execute(select(Cage).where(Cage.active==True, Cage.ends_at <= now))
            for cage in result.scalars():
                cage.active = False
            await s.commit()

async def amain():
    # create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    bot = MadameBot()
    # load commands before login so they exist for sync
    from .commands import register_all
    register_all(bot)

    await bot.start(settings.token)

def main():
    asyncio.run(amain())

if __name__ == "__main__":
    main()
