"""Маршруты для получения списка типов процедур."""
from typing import List

from fastapi import APIRouter

from ..models import ProcedureType
from ..storage import PROCEDURES

router = APIRouter(prefix="/procedures", tags=["procedures"])


@router.get("/", response_model=List[ProcedureType])
def list_procedures() -> List[ProcedureType]:
    """Получить список всех типов процедур (публично)."""
    return PROCEDURES
