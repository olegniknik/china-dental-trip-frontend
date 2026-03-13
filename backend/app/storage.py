"""Простейшее in-memory хранилище.

В реальном проекте это место займёт база данных и репозитории.
Сейчас для простоты используем обычные списки и один объект клиники.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List
import uuid

from .config import settings
from .models import (
    ApplicationCreate,
    ApplicationOut,
    ApplicationStatus,
    Clinic,
    ProcedureType,
    ProcedureTypeEnum,
    Role,
    UserCreate,
    UserOut,
)
from .security import hash_password


# ------------------- Пользователи -------------------

USERS: List[dict] = []


def init_admin_user() -> UserOut:
    """Создать администратора из настроек, если его ещё нет.

    Так как у нас нет базы, ищем по email в in-memory списке.
    """
    existing = next((u for u in USERS if u["email"] == settings.admin_email), None)
    if existing:
        return UserOut(**existing)

    now = datetime.now(timezone.utc)
    user_dict = {
        "id": str(uuid.uuid4()),
        "email": settings.admin_email,
        "role": Role.ADMIN,
        "created_at": now,
        "password_hash": hash_password(settings.admin_password),
    }
    USERS.append(user_dict)
    return UserOut(**user_dict)


def create_user(data: UserCreate) -> UserOut:
    now = datetime.now(timezone.utc)
    user_dict = {
        "id": str(uuid.uuid4()),
        "email": data.email,
        "role": data.role,
        "created_at": now,
        "password_hash": hash_password(data.password),
    }
    USERS.append(user_dict)
    return UserOut(**user_dict)


# ------------------- Заявки -------------------

APPLICATIONS: List[dict] = []


def create_application(data: ApplicationCreate) -> ApplicationOut:
    now = datetime.now(timezone.utc)
    app_dict = {
        "id": str(uuid.uuid4()),
        "status": ApplicationStatus.NEW,
        "created_at": now,
        **data.model_dump(),
    }
    APPLICATIONS.append(app_dict)
    return ApplicationOut(**app_dict)


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
