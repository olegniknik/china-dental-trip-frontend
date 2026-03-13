"""Маршруты для работы с заявками клиентов."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..dependencies import require_any_role
from ..models import (
    ApplicationCreate,
    ApplicationGoal,
    ApplicationOut,
    ApplicationStatus,
    ApplicationUpdate,
    ProcedureTypeEnum,
    Role,
    UserOut,
)
from ..storage import APPLICATIONS, create_application

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("/", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application_public(data: ApplicationCreate) -> ApplicationOut:
    """Публичная точка для создания заявки с сайта.

    Авторизация не требуется, данные хранятся в памяти.
    """
    # Простое бизнес-правило: если есть операции на лице, требуем пояснение
    if data.has_face_operations and (not data.face_operation_details or len(data.face_operation_details) < 5):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Укажите подробности предыдущих операций на лице",
        )
    return create_application(data)


@router.get("/", response_model=List[ApplicationOut])
def list_applications(
    _: UserOut = Depends(require_any_role(Role.ADMIN, Role.OPERATOR)),
    status_filter: Optional[ApplicationStatus] = Query(default=None, alias="status"),
    goal: Optional[ApplicationGoal] = None,
    procedure_type: Optional[ProcedureTypeEnum] = None,
) -> List[ApplicationOut]:
    """Список заявок (только админ/оператор) с простыми фильтрами."""
    result = APPLICATIONS.copy()
    if status_filter is not None:
        result = [a for a in result if a["status"] == status_filter]
    if goal is not None:
        result = [a for a in result if a.get("goal") == goal]
    if procedure_type is not None:
        result = [a for a in result if a.get("procedure_type") == procedure_type]

    return [ApplicationOut(**a) for a in result]


@router.get("/{app_id}", response_model=ApplicationOut)
def get_application(app_id: str, _: UserOut = Depends(require_any_role(Role.ADMIN, Role.OPERATOR))) -> ApplicationOut:
    """Получить одну заявку по id (только админ/оператор)."""
    app_raw = next((a for a in APPLICATIONS if a["id"] == app_id), None)
    if not app_raw:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return ApplicationOut(**app_raw)


@router.patch("/{app_id}", response_model=ApplicationOut)
def update_application(app_id: str, data: ApplicationUpdate, _: UserOut = Depends(require_any_role(Role.ADMIN, Role.OPERATOR))) -> ApplicationOut:
    """Обновить статус и комментарий по заявке."""
    app_raw = next((a for a in APPLICATIONS if a["id"] == app_id), None)
    if not app_raw:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    update_dict = data.model_dump(exclude_unset=True)
    app_raw.update(update_dict)
    return ApplicationOut(**app_raw)


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(app_id: str, _: UserOut = Depends(require_any_role(Role.ADMIN, Role.OPERATOR))) -> None:
    """Удалить заявку (для демо; в реале лучше архивировать)."""
    index = next((i for i, a in enumerate(APPLICATIONS) if a["id"] == app_id), None)
    if index is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    APPLICATIONS.pop(index)
