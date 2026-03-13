"""Маршруты для информации о клинике."""
from fastapi import APIRouter, Depends

from ..dependencies import require_role
from ..models import Clinic, Role, UserOut
from ..storage import CLINIC

router = APIRouter(prefix="/clinic", tags=["clinic"])


@router.get("/", response_model=Clinic)
def get_clinic() -> Clinic:
    """Получить информацию о клинике (публично)."""
    return CLINIC


@router.patch("/", response_model=Clinic)
def update_clinic(data: Clinic, _: UserOut = Depends(require_role(Role.ADMIN))) -> Clinic:
    """Полностью обновить данные клиники (для простоты — заменой объекта)."""
    global CLINIC  # type: ignore
    CLINIC = data
    return CLINIC
