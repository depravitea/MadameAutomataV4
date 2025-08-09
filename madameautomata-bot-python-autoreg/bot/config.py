from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    token: str = os.getenv("DISCORD_TOKEN", "")
    client_id: str = os.getenv("DISCORD_CLIENT_ID", "")
    guild_id: str = os.getenv("DISCORD_GUILD_ID", "")
    database_url: str = os.getenv("DATABASE_URL", "")

    # NEW: flags for auto-registration
    register_on_boot: bool = os.getenv("REGISTER_ON_BOOT", "true").lower() in ("1", "true", "yes")
    register_global: bool = os.getenv("REGISTER_GLOBAL", "false").lower() in ("1", "true", "yes")

settings = Settings()
