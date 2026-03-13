"""Экспортируем роутеры как пакет для удобного импорта в main.py."""
from . import auth, users, applications, clinic, procedures  # noqa: F401

__all__ = ["auth", "users", "applications", "clinic", "procedures"]
