"""Простейшая настройка SQLite через SQLAlchemy.

База лежит в файле `app.db` в корне backend.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Boolean, DateTime, String, Text, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)


class Base(DeclarativeBase):
    pass


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class UserORM(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class ApplicationORM(Base):
    __tablename__ = "applications"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    first_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    preferred_dates: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    goal: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    procedure_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    has_face_operations: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    face_operation_details: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    chronic_diseases: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    allergies: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    has_medical_files: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    comment: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)


def init_db() -> None:
    """Создать таблицы, если их ещё нет."""
    Base.metadata.create_all(bind=engine)

