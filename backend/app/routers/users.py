"""Маршруты управления пользователями (только для админа)."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import require_role
from ..models import Role, UserCreate, UserOut, UserUpdate
from ..storage import USERS, create_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=List[UserOut])
def list_users(_: UserOut = Depends(require_role(Role.ADMIN))) -> List[UserOut]:
    """Получить список всех пользователей (только админ)."""
    return [UserOut(**u) for u in USERS]


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(data: UserCreate, _: UserOut = Depends(require_role(Role.ADMIN))) -> UserOut:
    """Создать нового пользователя (только админ)."""
    if any(u["email"].lower() == data.email.lower() for u in USERS):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email already exists")
    return create_user(data)


@router.patch("/{user_id}", response_model=UserOut)
def update_user(user_id: str, data: UserUpdate, _: UserOut = Depends(require_role(Role.ADMIN))) -> UserOut:
    """Обновить данные пользователя (email/роль/пароль)."""
    user_raw = next((u for u in USERS if u["id"] == user_id), None)
    if not user_raw:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if data.email is not None:
        if any(u["email"].lower() == data.email.lower() and u["id"] != user_id for u in USERS):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email already exists")
        user_raw["email"] = data.email

    if data.role is not None:
        user_raw["role"] = data.role

    if data.password is not None:
        from ..security import hash_password

        user_raw["password_hash"] = hash_password(data.password)

    return UserOut(**user_raw)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str, _: UserOut = Depends(require_role(Role.ADMIN))) -> None:
    """Удалить пользователя (демо-вариант, без мягкого удаления)."""
    index = next((i for i, u in enumerate(USERS) if u["id"] == user_id), None)
    if index is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    USERS.pop(index)
