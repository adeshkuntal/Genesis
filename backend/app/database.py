from __future__ import annotations

import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_SQLITE_PATH = BASE_DIR / "genesis.db"

# Local dev: no DATABASE_URL set -> falls back to a local SQLite file.
# Production (Render, etc.): set DATABASE_URL to a managed Postgres
# instance - Render's free web services have an EPHEMERAL filesystem, so
# SQLite data is wiped on every redeploy/restart unless you attach a paid
# persistent disk. Postgres is the reliable choice for production.
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{DEFAULT_SQLITE_PATH}")

# Some hosts (Render, Heroku, etc.) hand out the URL with the legacy
# "postgres://" scheme, but SQLAlchemy 2.0 requires "postgresql://".
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()