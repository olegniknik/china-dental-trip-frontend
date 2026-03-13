"""Простая обёртка для хеширования паролей и работы с JWT.

Важно: это учебный пример.
Для простоты вместо bcrypt используется sha256-хеширование.
"""
from datetime import datetime, timedelta, timezone
from hashlib import sha256
from typing import Any, Dict, Optional

from jose import JWTError, jwt

from .config import settings


def hash_password(password: str) -> str:
    """Вернуть sha256-хеш пароля (упрощённо, только для демо)."""
    return sha256(password.encode("utf-8")).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверить, соответствует ли пароль хешу (sha256)."""
    return hash_password(plain_password) == hashed_password


def create_access_token(data: Dict[str, Any], expires_minutes: Optional[int] = None) -> str:
    """Создать JWT-токен с заданным сроком действия.

    В payload обычно кладём user_id и роль.
    """
    to_encode = data.copy()
    expire_delta = timedelta(minutes=expires_minutes or settings.jwt_expire_minutes)
    expire = datetime.now(timezone.utc) + expire_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Декодировать JWT-токен и вернуть payload, либо None при ошибке."""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return None
    return payload
