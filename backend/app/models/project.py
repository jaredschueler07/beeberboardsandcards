import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), default="Untitled Game")
    brief: Mapped[str] = mapped_column(Text, default="")
    brief_settings: Mapped[dict] = mapped_column(JSON, default=dict)
    concept_brief: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    selected_concept_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    rule_set: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    balance_report: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    style_guide: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    current_stage: Mapped[str] = mapped_column(String(20), default="brief")
    version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    card_types: Mapped[list["CardType"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    cards: Mapped[list["Card"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    concepts: Mapped[list["GameConcept"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )


class GameConcept(Base):
    __tablename__ = "game_concepts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, default="")
    mechanics: Mapped[list] = mapped_column(JSON, default=list)
    comparable_games: Mapped[list] = mapped_column(JSON, default=list)
    score: Mapped[float] = mapped_column(Float, default=0.0)

    project: Mapped["Project"] = relationship(back_populates="concepts")


class CardType(Base):
    __tablename__ = "card_types"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255))
    color: Mapped[str] = mapped_column(String(7), default="#3B82F6")
    icon: Mapped[str] = mapped_column(String(50), default="layers")
    count: Mapped[int] = mapped_column(Integer, default=1)

    project: Mapped["Project"] = relationship(back_populates="card_types")
    cards: Mapped[list["Card"]] = relationship(back_populates="card_type")


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"))
    type_id: Mapped[str] = mapped_column(ForeignKey("card_types.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255))
    cost: Mapped[int] = mapped_column(Integer, default=0)
    stats: Mapped[dict] = mapped_column(JSON, default=dict)
    effect: Mapped[str] = mapped_column(Text, default="")
    flavor_text: Mapped[str] = mapped_column(Text, default="")
    art_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    project: Mapped["Project"] = relationship(back_populates="cards")
    card_type: Mapped["CardType"] = relationship(back_populates="cards")
