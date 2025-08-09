
from .db import Session, Config
from sqlalchemy import select
from discord import Member

async def _get_cfg():
    async with Session() as s:
        row = (await s.execute(select(Config).where(Config.id==1))).scalar_one_or_none()
        return row

async def is_domme(m: Member | None) -> bool:
    if not m: return False
    cfg = await _get_cfg()
    if not cfg or not cfg.domme_role_id: return False
    return any(r.id == cfg.domme_role_id for r in m.roles)

async def is_sub(m: Member | None) -> bool:
    if not m: return False
    cfg = await _get_cfg()
    if not cfg or not cfg.sub_role_id: return False
    return any(r.id == cfg.sub_role_id for r in m.roles)

async def is_staff(m: Member | None) -> bool:
    if not m: return False
    cfg = await _get_cfg()
    if not cfg or not cfg.staff_role_id: return False
    return any(r.id == cfg.staff_role_id for r in m.roles)
