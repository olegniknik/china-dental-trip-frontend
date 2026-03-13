"""Настройки приложения на основе переменных окружения (.env).

Пока проект небольшой, все настройки держим в одном классе Settings.
"""
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Общие настройки
    app_name: str = "China Dental Trip API"

    # JWT
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    # Админ по умолчанию (создаётся в памяти при старте)
    admin_email: str
    admin_password: str

    # CORS
    frontend_origin: str = "http://127.0.0.1:5173"

    # E-mail уведомления о заявках (SMTP опционально)
    smtp_host: Optional[str] = None
    smtp_port: int = 587
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_from: Optional[str] = None
    notifications_email: str = "nikiforov-kslksl@yandex.ru"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
