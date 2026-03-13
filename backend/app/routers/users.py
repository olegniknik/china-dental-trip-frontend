"""Маршруты управления пользователями (только для админа)."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import require_role
from ..models import Role, UserCreate, UserOut, UserUpdate
from ..storage import (
    create_user,
    delete_user_in_db,
    is_email_taken,
    is_email_taken_by_other,
    list_users,
    update_user_in_db,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=List[UserOut])
def list_users(_: UserOut = Depends(require_role(Role.ADMIN))) -> List[UserOut]:
    """Получить список всех пользователей (только админ)."""
    return list_users()


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(data: UserCreate, _: UserOut = Depends(require_role(Role.ADMIN))) -> UserOut:
    """Создать нового пользователя (только админ)."""
    if is_email_taken(data.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email already exists")
    return create_user(data)


@router.patch("/{user_id}", response_model=UserOut)
def update_user(user_id: str, data: UserUpdate, _: UserOut = Depends(require_role(Role.ADMIN))) -> UserOut:
    """Обновить данные пользователя (email/роль/пароль)."""
    if data.email is not None and is_email_taken_by_other(data.email, user_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email already exists")

    updated = update_user_in_db(user_id, data)
    if updated is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return updated


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str, _: UserOut = Depends(require_role(Role.ADMIN))) -> None:
    """Удалить пользователя (демо-вариант, без мягкого удаления)."""
    ok = delete_user_in_db(user_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

