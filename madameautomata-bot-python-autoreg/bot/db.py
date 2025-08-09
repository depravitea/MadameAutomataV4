
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, DateTime, Integer, Enum, ForeignKey, Text
from datetime import datetime
import enum
from .config import settings

engine = create_async_engine(settings.database_url, echo=False)
Session = async_sessionmaker(engine, expire_on_commit=False)

class Base(AsyncAttrs, DeclarativeBase):
    pass

class CollarType(str, enum.Enum):
    CONSIDERATION = "CONSIDERATION"
    TRAINING = "TRAINING"
    PERMANENT = "PERMANENT"

class StarStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    DENIED = "DENIED"

class User(Base):
    __tablename__ = "user"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_domme: Mapped[bool] = mapped_column(Boolean, default=False)
    is_sub: Mapped[bool] = mapped_column(Boolean, default=False)
    titles: Mapped[str | None] = mapped_column(Text, nullable=True)
    about: Mapped[str | None] = mapped_column(Text, nullable=True)
    limits: Mapped[str | None] = mapped_column(Text, nullable=True)
    domme_xp: Mapped[int] = mapped_column(Integer, default=0)
    domme_releases: Mapped[int] = mapped_column(Integer, default=0)

class Collaring(Base):
    __tablename__ = "collaring"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    domme_id: Mapped[str] = mapped_column(String, ForeignKey("user.id"))
    sub_id: Mapped[str] = mapped_column(String, ForeignKey("user.id"))
    type: Mapped[CollarType] = mapped_column(Enum(CollarType))
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

class Cage(Base):
    __tablename__ = "cage"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    sub_id: Mapped[str] = mapped_column(String, ForeignKey("user.id"))
    domme_id: Mapped[str] = mapped_column(String, ForeignKey("user.id"))
    ends_at: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    active: Mapped[bool] = mapped_column(Boolean, default=True)

class JailSession(Base):
    __tablename__ = "jail_session"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    sub_id: Mapped[str] = mapped_column(String, ForeignKey("user.id"))
    domme_id: Mapped[str] = mapped_column(String, ForeignKey("user.id"))
    brat: Mapped[bool] = mapped_column(Boolean, default=False)
    sentence_text: Mapped[str] = mapped_column(Text)
    total_needed: Mapped[int] = mapped_column(Integer)
    mistakes: Mapped[int] = mapped_column(Integer, default=0)
    completed: Mapped[int] = mapped_column(Integer, default=0)
    case_seed: Mapped[int] = mapped_column(Integer)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Star(Base):
    __tablename__ = "star"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    domme_id: Mapped[str] = mapped_column(String, ForeignKey("user.id"))
    sub_id: Mapped[str] = mapped_column(String, ForeignKey("user.id"))
    amount: Mapped[int] = mapped_column(Integer)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[StarStatus] = mapped_column(Enum(StarStatus), default=StarStatus.PENDING)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Task(Base):
    __tablename__ = "task"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    owner_id: Mapped[str] = mapped_column(String, ForeignKey("user.id"))
    assignee_id: Mapped[str] = mapped_column(String, ForeignKey("user.id"))
    title: Mapped[str] = mapped_column(Text)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)
    due_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    accepted: Mapped[bool] = mapped_column(Boolean, default=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    approved: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Worship(Base):
    __tablename__ = "worship"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    sub_id: Mapped[str] = mapped_column(String, ForeignKey("user.id"))
    domme_id: Mapped[str | None] = mapped_column(String, nullable=True)
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Config(Base):
    __tablename__ = "config"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    domme_role_id: Mapped[str | None] = mapped_column(String, nullable=True)
    sub_role_id: Mapped[str | None] = mapped_column(String, nullable=True)
    taskslut_role_id: Mapped[str | None] = mapped_column(String, nullable=True)
    worshipme_role_id: Mapped[str | None] = mapped_column(String, nullable=True)
    staff_role_id: Mapped[str | None] = mapped_column(String, nullable=True)
    jail_channel_id: Mapped[str | None] = mapped_column(String, nullable=True)
    bratjail_channel_id: Mapped[str | None] = mapped_column(String, nullable=True)
    worship_channel_id: Mapped[str | None] = mapped_column(String, nullable=True)
    staff_alerts_channel_id: Mapped[str | None] = mapped_column(String, nullable=True)
