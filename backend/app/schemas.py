from __future__ import annotations

import datetime as dt
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------
class SignupIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    plan: str
    created_at: dt.datetime

    class Config:
        from_attributes = True


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Blogs ----------
class GenerateIn(BaseModel):
    topic: str = Field(..., min_length=3)
    as_of: Optional[str] = None  # ISO date; defaults to today


class BlogListItem(BaseModel):
    id: int
    title: str
    topic: str
    status: str
    blog_kind: Optional[str] = ""
    created_at: dt.datetime
    updated_at: dt.datetime

    class Config:
        from_attributes = True


class BlogDetail(BaseModel):
    id: int
    title: str
    topic: str
    status: str
    error: Optional[str] = ""
    mode: Optional[str] = ""
    blog_kind: Optional[str] = ""
    as_of: str
    plan: Optional[Any] = None
    evidence: Optional[List[Any]] = None
    final_md: Optional[str] = ""
    progress: Optional[Any] = None
    created_at: dt.datetime
    updated_at: dt.datetime

    class Config:
        from_attributes = True
