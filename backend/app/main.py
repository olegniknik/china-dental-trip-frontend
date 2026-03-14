"""Точка входа FastAPI-приложения.

Здесь подключаем роутеры и настраиваем CORS.
Команда для запуска (из папки backend):

    uvicorn app.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import applications, auth, clinic, procedures, users
from .storage import init_admin_user, init_db


def create_app() -> FastAPI:
    # Создаём экземпляр приложения
    app = FastAPI(title=settings.app_name)

    # CORS: разрешаем и localhost, и 127.0.0.1 для фронта на 5173
    origins = [
        settings.frontend_origin,
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(dict.fromkeys(origins)),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Инициализируем базу и администратора
    init_db()
    init_admin_user()

    # Простой health-check, удобно для фронтенда и мониторинга
    @app.get("/health", tags=["meta"])
    def health() -> dict:
        return {"status": "ok"}

    # Подключаем роутеры
    app.include_router(auth.router)
    app.include_router(users.router)
    app.include_router(applications.router)
    app.include_router(clinic.router)
    app.include_router(procedures.router)

    return app


app = create_app()
