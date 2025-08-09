# MadameAutomata (Python Edition)

A Crimson Peak × Nosferatu–styled Discord bot built with **Python** and **discord.py** — no Node required.

## Features
- Slash commands: cage/caged, collar, domprofile, subprofile, jail, bratjail, red, release,
  star (give/take/inventory), starchart, task, taskcomplete, worship, punish, setup.
- DB-backed config via PostgreSQL (Railway-ready). Local dev can use SQLite by setting DATABASE_URL.
- Easy theme: `bot/theme.py`

## Quick Start
1. Install Python 3.11+
2. `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and fill `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`, `DATABASE_URL`
4. Run DB migrations (auto-create on first run)
5. Register commands: `python -m bot.register`
6. Start: `python -m bot`

## Railway
- Deploy from GitHub.
- Variables: `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`, `DATABASE_URL`
- Start command: `python -m bot`

## Auto-register flags
- `REGISTER_ON_BOOT=true` (default) — sync slash commands every time the bot starts.
- `REGISTER_GLOBAL=true` — register globally (slower propagation); omit to use guild-only fast sync.
