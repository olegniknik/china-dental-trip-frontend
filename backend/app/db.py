"""SQLAlchemy ORM и сессия для SQLite.

Таблицы: users, applications. Инициализация при старте приложения.
"""
from datetime import datetime
from typing import Optional

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

from .config import settings


# URL SQLite по умолчанию (файл в папке backend)
DATABASE_URL = getattr(settings, "database_url", None) or "sqlite:///./app.db"


class Base(DeclarativeBase):
    pass


class UserORM(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    role: Mapped[str] = mapped_column()
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    password_hash: Mapped[str] = mapped_column()


class ApplicationORM(Base):
    __tablename__ = "applications"

    id: Mapped[str] = mapped_column(primary_key=True)
    status: Mapped[str] = mapped_column()
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    first_name: Mapped[Optional[str]] = mapped_column(default=None)
    last_name: Mapped[Optional[str]] = mapped_column(default=None)
    phone: Mapped[str] = mapped_column()
    email: Mapped[Optional[str]] = mapped_column(default=None)
    city: Mapped[Optional[str]] = mapped_column(default=None)
    preferred_dates: Mapped[Optional[str]] = mapped_column(default=None)
    goal: Mapped[Optional[str]] = mapped_column(default=None)
    procedure_type: Mapped[Optional[str]] = mapped_column(default=None)
    has_face_operations: Mapped[Optional[bool]] = mapped_column(default=None)
    face_operation_details: Mapped[Optional[str]] = mapped_column(default=None)
    chronic_diseases: Mapped[Optional[str]] = mapped_column(default=None)
    allergies: Mapped[Optional[str]] = mapped_column(default=None)
    has_medical_files: Mapped[bool] = mapped_column(default=False)
    comment: Mapped[Optional[str]] = mapped_column(default=None)


engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    """Создать все таблицы, если их ещё нет."""
    Base.metadata.create_all(bind=engine)
