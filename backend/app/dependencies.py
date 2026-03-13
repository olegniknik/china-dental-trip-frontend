"""Общие зависимости FastAPI: текущий пользователь, проверка ролей и т.д."""
from typing import Annotated, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .models import Role, TokenPayload, UserOut
from .security import decode_access_token
from .storage import get_user_by_id

security_scheme = HTTPBearer(auto_error=False)


def get_current_user(creds: Annotated[Optional[HTTPAuthorizationCredentials], Depends(security_scheme)]) -> UserOut:
    """Получить текущего пользователя по JWT из заголовка Authorization.

    Если токен отсутствует или некорректен — выбрасываем 401.
    """
    if creds is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")

    payload_dict = decode_access_token(creds.credentials)
    if payload_dict is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    payload = TokenPayload.model_validate(payload_dict)
    user = get_user_by_id(payload.sub)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user


def require_role(required: Role):
    """Фабрика зависимостей, проверяющая роль пользователя."""

    def checker(user: Annotated[UserOut, Depends(get_current_user)]) -> UserOut:
        if user.role != required:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user

    return checker


def require_any_role(*roles: Role):
    """Проверка, что у пользователя одна из заданных ролей."""

    def checker(user: Annotated[UserOut, Depends(get_current_user)]) -> UserOut:
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user

    return checker
