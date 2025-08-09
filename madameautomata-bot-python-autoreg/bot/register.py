
import asyncio
import discord
from discord import app_commands
from .config import settings
from .__main__ import MadameBot

async def run():
    bot = MadameBot()
    await bot.login(settings.token)
    await bot.setup_hook()
    # rely on setup_hook sync
    await bot.close()

if __name__ == "__main__":
    asyncio.run(run())
