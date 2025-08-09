
import discord, random
from ..db import Session, JailSession
from ..theme import gothic_embed
from ..util.time import random_case

def setup(bot):
    @bot.event
    async def on_message(message: discord.Message):
        if message.author.bot or not message.guild:
            return
        # check active jail sessions
        async with Session() as s:
            sessions = (await s.execute(
                JailSession.__table__.select().where(JailSession.sub_id==str(message.author.id), JailSession.active==True)
            )).all()
        if not sessions:
            return
        for row in sessions:
            srow = row[0]
            expected = random_case(srow.sentence_text, random.randint(1, 1_000_000_000) if srow.brat else srow.case_seed)
            if message.content.strip() == expected:
                async with Session() as s:
                    js = await s.get(JailSession, srow.id)
                    js.completed += 1
                    done = js.completed
                    if done >= js.total_needed:
                        js.active = False
                        await s.commit()
                        await message.reply(embed=gothic_embed("Jail Complete", "Sentence satisfied."))
                    else:
                        await s.commit()
                        try: await message.add_reaction("🦇")
                        except: pass
            else:
                if srow.brat:
                    async with Session() as s:
                        js = await s.get(JailSession, srow.id)
                        js.mistakes += 1
                        js.total_needed += 1
                        await s.commit()
                        await message.channel.send("Mistake detected. Total increased by 1.")
