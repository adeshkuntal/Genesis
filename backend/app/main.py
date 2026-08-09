from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models  # noqa: F401  (register models on Base metadata)
from .routers import auth, blogs

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Genesis API", version="1.0.0")

# Local dev origins are always allowed. In production, set FRONTEND_URL to
# your deployed frontend's origin (e.g. https://genesis.vercel.app) - comma-
# separate multiple values if you have preview deployments too.
_default_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
_extra_origins = [o.strip() for o in os.environ.get("FRONTEND_URL", "").split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_default_origins + _extra_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(blogs.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "genesis-api"}