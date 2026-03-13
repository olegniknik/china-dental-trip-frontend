"""Pydantic-модели (DTO) для запросов и ответов.

Отдельно описываем входные данные (Create/Update) и то, что возвращаем наружу.
"""
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class Role(str, Enum):
    ADMIN = "admin"
    OPERATOR = "operator"


class UserBase(BaseModel):
    email: EmailStr = Field(..., description="Логин пользователя")
    role: Role = Field(Role.OPERATOR, description="Роль пользователя")


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Пароль (минимум 8 символов)")


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[Role] = None
    password: Optional[str] = Field(default=None, min_length=8)


class UserOut(UserBase):
    id: str
    created_at: datetime


# ------------------- Заявки -------------------


class ApplicationStatus(str, Enum):
    NEW = "new"
    IN_REVIEW = "in_review"
    SCHEDULED = "scheduled"
    CLOSED = "closed"


class ApplicationGoal(str, Enum):
    CONSULT = "consult"
    IMPLANT = "implant"
    PROSTHETICS = "prosthetics"
    OTHER = "other"


class ProcedureTypeEnum(str, Enum):
    BLEPHARO = "blepharo"
    FACELIFT = "facelift"
    INJECTIONS = "injections"
    LASER = "laser"


class ApplicationCreate(BaseModel):
    first_name: Optional[str] = Field(default=None, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    phone: str = Field(..., min_length=6, max_length=50)
    email: Optional[EmailStr] = None
    city: Optional[str] = Field(default=None, max_length=100)
    preferred_dates: Optional[str] = Field(default=None, max_length=255)
    goal: Optional[ApplicationGoal] = None
    procedure_type: Optional[ProcedureTypeEnum] = None
    has_face_operations: Optional[bool] = None
    face_operation_details: Optional[str] = Field(default=None, max_length=1000)
    chronic_diseases: Optional[str] = Field(default=None, max_length=1000)
    allergies: Optional[str] = Field(default=None, max_length=1000)
    has_medical_files: bool = Field(default=False)
    comment: Optional[str] = Field(default=None, max_length=2000)


class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None
    comment: Optional[str] = Field(default=None, max_length=2000)


class ApplicationOut(ApplicationCreate):
    id: str
    status: ApplicationStatus
    created_at: datetime


# ------------------- Клиника и процедуры -------------------


class Clinic(BaseModel):
    id: str
    name: str
    description: str
    specializations: list[str]
    rating: float = Field(ge=0, le=5)
    certificates: list[str]
    avg_price_info: str


class ProcedureType(BaseModel):
    id: ProcedureTypeEnum
    title: str
    description: str


# ------------------- Auth -------------------


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    role: Role


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
