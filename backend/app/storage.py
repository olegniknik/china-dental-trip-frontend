"""Хранилище данных поверх SQLite.

Реальная база: SQLite-файл `app.db` через SQLAlchemy.
Клиника и процедуры пока остаются захардкоженными в памяти.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional
import uuid

from .config import settings
from .db import ApplicationORM, SessionLocal, UserORM, init_db as _init_db
from .models import (
    ApplicationCreate,
    ApplicationGoal,
    ApplicationOut,
    ApplicationStatus,
    Clinic,
    ProcedureType,
    ProcedureTypeEnum,
    Role,
    UserCreate,
    UserOut,
    UserUpdate,
)
from .security import hash_password


def init_db() -> None:
    """Создать таблицы, если их ещё нет."""
    _init_db()


# ------------------- Пользователи -------------------


def _user_from_orm(obj: UserORM) -> UserOut:
    return UserOut(id=obj.id, email=obj.email, role=Role(obj.role), created_at=obj.created_at)


def init_admin_user() -> UserOut:
    """Создать администратора из настроек, если его ещё нет. Если уже есть — обновить пароль из .env."""
    from sqlalchemy import select

    with SessionLocal() as db:
        stmt = select(UserORM).where(UserORM.email == settings.admin_email.lower())
        existing = db.execute(stmt).scalar_one_or_none()
        if existing:
            # Чтобы вход по ADMIN_EMAIL/ADMIN_PASSWORD из .env всегда работал
            existing.password_hash = hash_password(settings.admin_password)
            db.add(existing)
            db.commit()
            return _user_from_orm(existing)

        now = datetime.now(timezone.utc)
        user = UserORM(
            id=str(uuid.uuid4()),
            email=settings.admin_email.lower(),
            role=Role.ADMIN.value,
            created_at=now,
            password_hash=hash_password(settings.admin_password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return _user_from_orm(user)


def create_user(data: UserCreate) -> UserOut:
    now = datetime.now(timezone.utc)
    with SessionLocal() as db:
        user = UserORM(
            id=str(uuid.uuid4()),
            email=data.email.lower(),
            role=data.role.value,
            created_at=now,
            password_hash=hash_password(data.password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return _user_from_orm(user)


def list_users() -> List[UserOut]:
    from sqlalchemy import select

    with SessionLocal() as db:
        stmt = select(UserORM).order_by(UserORM.created_at.desc())
        rows = db.execute(stmt).scalars().all()
        return [_user_from_orm(u) for u in rows]


def get_user_by_id(user_id: str) -> Optional[UserOut]:
    with SessionLocal() as db:
        obj = db.get(UserORM, user_id)
        if obj is None:
            return None
        return _user_from_orm(obj)


def get_user_for_auth(email: str) -> Optional[dict]:
    """Найти пользователя по email для авторизации (с хешем пароля)."""
    from sqlalchemy import select

    with SessionLocal() as db:
        stmt = select(UserORM).where(UserORM.email == email.lower())
        obj = db.execute(stmt).scalar_one_or_none()
        if obj is None:
            return None
        return {
            "id": obj.id,
            "email": obj.email,
            "role": Role(obj.role),
            "password_hash": obj.password_hash,
        }


def is_email_taken(email: str) -> bool:
    from sqlalchemy import select

    with SessionLocal() as db:
        stmt = select(UserORM).where(UserORM.email == email.lower())
        return db.execute(stmt).scalar_one_or_none() is not None


def is_email_taken_by_other(email: str, user_id: str) -> bool:
    from sqlalchemy import select

    with SessionLocal() as db:
        stmt = select(UserORM).where(UserORM.email == email.lower(), UserORM.id != user_id)
        return db.execute(stmt).scalar_one_or_none() is not None


def update_user_in_db(user_id: str, data: UserUpdate) -> Optional[UserOut]:
    from sqlalchemy import select

    with SessionLocal() as db:
        stmt = select(UserORM).where(UserORM.id == user_id)
        obj = db.execute(stmt).scalar_one_or_none()
        if obj is None:
            return None

        if data.email is not None:
            obj.email = data.email.lower()
        if data.role is not None:
            obj.role = data.role.value
        if data.password is not None:
            obj.password_hash = hash_password(data.password)

        db.add(obj)
        db.commit()
        db.refresh(obj)
        return _user_from_orm(obj)


def delete_user_in_db(user_id: str) -> bool:
    from sqlalchemy import select

    with SessionLocal() as db:
        stmt = select(UserORM).where(UserORM.id == user_id)
        obj = db.execute(stmt).scalar_one_or_none()
        if obj is None:
            return False
        db.delete(obj)
        db.commit()
        return True


# ------------------- Заявки -------------------


def _application_from_orm(obj: ApplicationORM) -> ApplicationOut:
    return ApplicationOut(
        id=obj.id,
        status=ApplicationStatus(obj.status),
        created_at=obj.created_at,
        first_name=obj.first_name,
        last_name=obj.last_name,
        phone=obj.phone,
        email=obj.email,
        city=obj.city,
        preferred_dates=obj.preferred_dates,
        goal=ApplicationGoal(obj.goal) if obj.goal is not None else None,
        procedure_type=ProcedureTypeEnum(obj.procedure_type) if obj.procedure_type is not None else None,
        has_face_operations=obj.has_face_operations,
        face_operation_details=obj.face_operation_details,
        chronic_diseases=obj.chronic_diseases,
        allergies=obj.allergies,
        has_medical_files=obj.has_medical_files,
        comment=obj.comment,
    )


def create_application(data: ApplicationCreate) -> ApplicationOut:
    now = datetime.now(timezone.utc)
    payload = data.model_dump()
    with SessionLocal() as db:
        obj = ApplicationORM(
            id=str(uuid.uuid4()),
            status=ApplicationStatus.NEW.value,
            created_at=now,
            first_name=payload.get("first_name"),
            last_name=payload.get("last_name"),
            phone=payload["phone"],
            email=payload.get("email"),
            city=payload.get("city"),
            preferred_dates=payload.get("preferred_dates"),
            goal=payload.get("goal").value if payload.get("goal") is not None else None,
            procedure_type=payload.get("procedure_type").value if payload.get("procedure_type") is not None else None,
            has_face_operations=payload.get("has_face_operations"),
            face_operation_details=payload.get("face_operation_details"),
            chronic_diseases=payload.get("chronic_diseases"),
            allergies=payload.get("allergies"),
            has_medical_files=payload.get("has_medical_files", False),
            comment=payload.get("comment"),
        )
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return _application_from_orm(obj)


def list_applications_from_db(
    status_filter: Optional[ApplicationStatus],
    goal: Optional[ApplicationGoal],
    procedure_type: Optional[ProcedureTypeEnum],
) -> List[ApplicationOut]:
    from sqlalchemy import select

    with SessionLocal() as db:
        stmt = select(ApplicationORM).order_by(ApplicationORM.created_at.desc())
        if status_filter is not None:
            stmt = stmt.where(ApplicationORM.status == status_filter.value)
        if goal is not None:
            stmt = stmt.where(ApplicationORM.goal == goal.value)
        if procedure_type is not None:
            stmt = stmt.where(ApplicationORM.procedure_type == procedure_type.value)

        rows = db.execute(stmt).scalars().all()
        return [_application_from_orm(a) for a in rows]


def get_application_by_id(app_id: str) -> Optional[ApplicationOut]:
    with SessionLocal() as db:
        obj = db.get(ApplicationORM, app_id)
        if obj is None:
            return None
        return _application_from_orm(obj)


def update_application_in_db(app_id: str, data: ApplicationUpdate) -> Optional[ApplicationOut]:
    from sqlalchemy import select

    with SessionLocal() as db:
        stmt = select(ApplicationORM).where(ApplicationORM.id == app_id)
        obj = db.execute(stmt).scalar_one_or_none()
        if obj is None:
            return None

        update_dict = data.model_dump(exclude_unset=True)
        if "status" in update_dict and update_dict["status"] is not None:
            obj.status = update_dict["status"].value
        if "comment" in update_dict:
            obj.comment = update_dict["comment"]

        db.add(obj)
        db.commit()
        db.refresh(obj)
        return _application_from_orm(obj)


def delete_application_in_db(app_id: str) -> bool:
    from sqlalchemy import select

    with SessionLocal() as db:
        stmt = select(ApplicationORM).where(ApplicationORM.id == app_id)
        obj = db.execute(stmt).scalar_one_or_none()
        if obj is None:
            return False
        db.delete(obj)
        db.commit()
        return True


# ------------------- Клиника и процедуры -------------------

CLINIC: Clinic = Clinic(
    id="main",
    name="Проверенная многопрофильная клиника",
    description="Стоматология и эстетическая медицина с проверенными результатами.",
    specializations=["Стоматология", "Эстетическая хирургия"],
    rating=4.9,
    certificates=["Лицензия Минздрава КНР", "Международные сертификаты качества"],
    avg_price_info="Импланты от 80 000 ₽, комплексные программы по запросу",
)

PROCEDURES: List[ProcedureType] = [
    ProcedureType(id=ProcedureTypeEnum.BLEPHARO, title="Блефаропластика", description="Коррекция верхних и нижних век."),
    ProcedureType(id=ProcedureTypeEnum.FACELIFT, title="Подтяжка лица", description="Комплексные подтяжки лица и шеи."),
    ProcedureType(id=ProcedureTypeEnum.INJECTIONS, title="Инъекции", description="Филлеры, ботулинотерапия и другие методы."),
    ProcedureType(id=ProcedureTypeEnum.LASER, title="Лазерные процедуры", description="Омоложение, коррекция пигментации и др."),
]

