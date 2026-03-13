"""Маршруты авторизации (логин, получение токена)."""
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status

from ..models import LoginRequest, Role, Token, UserOut
from ..security import create_access_token, verify_password
from ..storage import get_user_for_auth

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(data: LoginRequest) -> Token:
    """Вход по email + паролю.

    Возвращаем accessToken, который фронт кладёт в Authorization: Bearer <token>.
    """
    user_raw = get_user_for_auth(data.email)
    if not user_raw:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if not verify_password(data.password, user_raw["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    payload = {
        "sub": user_raw["id"],
        "role": user_raw["role"],
        "iat": int(datetime.now(timezone.utc).timestamp()),
    }
    token = create_access_token(payload)
    return Token(access_token=token)
