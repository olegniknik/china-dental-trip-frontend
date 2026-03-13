"""Маршруты для работы с заявками клиентов."""
from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status

from ..dependencies import require_any_role
from ..email_utils import send_application_notification
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
from ..storage import (
    create_application,
    delete_application_in_db,
    get_application_by_id,
    list_applications_from_db,
    update_application_in_db,
)

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("/", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application_public(data: ApplicationCreate, background_tasks: BackgroundTasks) -> ApplicationOut:
    """Публичная точка для создания заявки с сайта.

    Авторизация не требуется, данные попадают в SQLite и на почту.
    """
    # Простое бизнес-правило: если есть операции на лице, требуем пояснение
    if data.has_face_operations and (not data.face_operation_details or len(data.face_operation_details) < 5):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Укажите подробности предыдущих операций на лице",
        )
    created = create_application(data)
    # Отправляем уведомление о новой заявке в фоне, чтобы не задерживать ответ.
    background_tasks.add_task(send_application_notification, created)
    return created


@router.get("/", response_model=List[ApplicationOut])
def list_applications(
    _: UserOut = Depends(require_any_role(Role.ADMIN, Role.OPERATOR)),
    status_filter: Optional[ApplicationStatus] = Query(default=None, alias="status"),
    goal: Optional[ApplicationGoal] = None,
    procedure_type: Optional[ProcedureTypeEnum] = None,
) -> List[ApplicationOut]:
    """Список заявок (только админ/оператор) с простыми фильтрами."""
    return list_applications_from_db(status_filter=status_filter, goal=goal, procedure_type=procedure_type)


@router.get("/{app_id}", response_model=ApplicationOut)
def get_application(app_id: str, _: UserOut = Depends(require_any_role(Role.ADMIN, Role.OPERATOR))) -> ApplicationOut:
    """Получить одну заявку по id (только админ/оператор)."""
    app_obj = get_application_by_id(app_id)
    if app_obj is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return app_obj


@router.patch("/{app_id}", response_model=ApplicationOut)
def update_application(app_id: str, data: ApplicationUpdate, _: UserOut = Depends(require_any_role(Role.ADMIN, Role.OPERATOR))) -> ApplicationOut:
    """Обновить статус и комментарий по заявке."""
    updated = update_application_in_db(app_id, data)
    if updated is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return updated


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(app_id: str, _: UserOut = Depends(require_any_role(Role.ADMIN, Role.OPERATOR))) -> None:
    """Удалить заявку (для демо; в реале лучше архивировать)."""
    ok = delete_application_in_db(app_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

