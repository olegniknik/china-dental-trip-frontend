"""Простой seed для базы SQLite.

Запуск из папки backend:

    python -m app.seed
"""
from __future__ import annotations

from .models import ApplicationCreate, ApplicationGoal, ProcedureTypeEnum, Role, UserCreate
from .storage import (
    create_application,
    create_user,
    init_admin_user,
    init_db,
)


def run() -> None:
    init_db()
    admin = init_admin_user()

    # Оператор
    operator = create_user(
        UserCreate(
            email="operator@example.com",
            role=Role.OPERATOR,
            password="operator12345",
        )
    )

    # Пара тестовых заявок
    create_application(
        ApplicationCreate(
            first_name="Анна",
            last_name="Иванова",
            phone="+79990000001",
            email="anna@example.com",
            city="Москва",
            preferred_dates="апрель 2026",
            goal=ApplicationGoal.IMPLANT,
            procedure_type=ProcedureTypeEnum.BLEPHARO,
            has_face_operations=False,
            chronic_diseases="гипертония",
            allergies="нет данных",
            has_medical_files=True,
            comment="Хочу совместить лечение зубов и лёгкую коррекцию век.",
        )
    )

    create_application(
        ApplicationCreate(
            first_name="Сергей",
            last_name="Петров",
            phone="+79990000002",
            email="sergey@example.com",
            city="Санкт-Петербург",
            preferred_dates="май 2026",
            goal=ApplicationGoal.CONSULT,
            procedure_type=ProcedureTypeEnum.INJECTIONS,
            has_face_operations=True,
            face_operation_details="Ринопластика 3 года назад",
            chronic_diseases="нет",
            allergies="аллергия на пенициллин",
            has_medical_files=False,
            comment="Интересуют мягкие инъекционные методики без резких изменений.",
        )
    )

    print("Seed выполнен. Созданы админ, оператор и две заявки.")


if __name__ == "__main__":
    run()

