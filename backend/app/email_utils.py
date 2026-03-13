"""Простая отправка писем через SMTP.

Настройки берём из `settings` (см. config.py).
Если SMTP не настроен, просто выходим тихо, чтобы не ломать API.
"""
from __future__ import annotations

import smtplib
from email.message import EmailMessage
from typing import Optional

from .config import settings
from .models import ApplicationOut


def _build_application_body(app: ApplicationOut) -> str:
    """Собрать текст письма по заявке."""
    lines: list[str] = []
    lines.append("Новая заявка с сайта «Лечение зубов в Китае».")
    lines.append("")
    lines.append(f"Телефон: {app.phone}")
    if app.email:
        lines.append(f"Email: {app.email}")
    if app.first_name or app.last_name:
        full_name = f"{app.first_name or ''} {app.last_name or ''}".strip()
        lines.append(f"Имя: {full_name}")
    if app.city:
        lines.append(f"Город вылета: {app.city}")
    if app.preferred_dates:
        lines.append(f"Даты / график: {app.preferred_dates}")
    if app.goal:
        lines.append(f"Цель поездки: {app.goal.value}")
    if app.procedure_type:
        lines.append(f"Тип процедуры: {app.procedure_type.value}")
    if app.has_face_operations is not None:
        lines.append(f"Были операции на лице: {'да' if app.has_face_operations else 'нет'}")
    if app.face_operation_details:
        lines.append(f"Детали операций: {app.face_operation_details}")
    if app.chronic_diseases:
        lines.append(f"Хронические болезни: {app.chronic_diseases}")
    if app.allergies:
        lines.append(f"Аллергии: {app.allergies}")
    if app.has_medical_files:
        lines.append("Есть мед. файлы: да (прикреплены в форме на сайте)")
    if app.comment:
        lines.append(f"Комментарий: {app.comment}")

    lines.append("")
    lines.append(f"ID заявки: {app.id}")
    lines.append(f"Статус в системе: {app.status.value}")
    lines.append(f"Создано: {app.created_at.isoformat()}")

    return "\n".join(lines)


def send_application_notification(app: ApplicationOut) -> None:
    """Отправить письмо о новой заявке.

    Ошибки SMTP глушим, чтобы не ломать обработку запроса с сайта.
    """
    if not settings.notifications_email:
        return

    # Если SMTP не настроен – quietly skip
    if not settings.smtp_host or not settings.smtp_user or not settings.smtp_password:
        return

    from_addr: str = settings.smtp_from or settings.smtp_user
    to_addr: str = settings.notifications_email

    msg = EmailMessage()
    msg["Subject"] = "Новая заявка с сайта (Китай, лечение зубов)"
    msg["From"] = from_addr
    msg["To"] = to_addr
    msg.set_content(_build_application_body(app))

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
    except Exception:
        # В демо-версии просто игнорируем ошибки отправки письма.
        # В реальном проекте здесь стоило бы логировать.
        return

