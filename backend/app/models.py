from __future__ import annotations

import datetime as dt

from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Boolean
)
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    plan = Column(String(30), default="Free")
    created_at = Column(DateTime, default=dt.datetime.utcnow)

    blogs = relationship("BlogPost", back_populates="owner", cascade="all, delete-orphan")


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    topic = Column(Text, nullable=False)
    as_of = Column(String(20), nullable=False)

    title = Column(String(255), default="")
    status = Column(String(20), default="queued")  # queued|running|completed|failed
    error = Column(Text, default="")

    mode = Column(String(20), default="")
    blog_kind = Column(String(40), default="")

    plan_json = Column(Text, default="")
    evidence_json = Column(Text, default="")
    final_md = Column(Text, default="")
    progress_json = Column(Text, default="")

    created_at = Column(DateTime, default=dt.datetime.utcnow)
    updated_at = Column(DateTime, default=dt.datetime.utcnow, onupdate=dt.datetime.utcnow)

    owner = relationship("User", back_populates="blogs")
