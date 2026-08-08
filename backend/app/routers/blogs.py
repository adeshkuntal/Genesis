from __future__ import annotations

import json
import re
import zipfile
from datetime import date
from io import BytesIO
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import Response, StreamingResponse
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db, SessionLocal
from ..deps import get_current_user
from ..engine.pipeline import graph_app, Plan, EvidenceItem

router = APIRouter(prefix="/api/blogs", tags=["blogs"])


def _safe_slug(title: str) -> str:
    s = title.strip().lower()
    s = re.sub(r"[^a-z0-9 _-]+", "", s)
    s = re.sub(r"\s+", "_", s).strip("_")
    return s or "blog"


def _merge_update(current: Dict[str, Any], payload: Any) -> Dict[str, Any]:
    """LangGraph 'updates' stream mode yields {node_name: partial_state}."""
    if isinstance(payload, dict):
        if len(payload) == 1 and isinstance(next(iter(payload.values())), dict):
            current.update(next(iter(payload.values())))
        else:
            current.update(payload)
    return current


def run_generation(blog_id: int, topic: str, as_of: str):
    db = SessionLocal()
    try:
        blog = db.query(models.BlogPost).get(blog_id)
        if not blog:
            return
        blog.status = "running"
        db.commit()

        inputs: Dict[str, Any] = {
            "topic": topic,
            "mode": "",
            "needs_research": False,
            "queries": [],
            "evidence": [],
            "plan": None,
            "as_of": as_of,
            "recency_days": 7,
            "sections": [],
            "final": "",
        }

        current_state: Dict[str, Any] = {}
        last_node = None

        for step in graph_app.stream(inputs, stream_mode="updates"):
            node_name = None
            if isinstance(step, dict) and len(step) == 1 and isinstance(next(iter(step.values())), dict):
                node_name = next(iter(step.keys()))
            current_state = _merge_update(current_state, step)

            plan_obj = current_state.get("plan")
            plan_dict = plan_obj.model_dump() if isinstance(plan_obj, Plan) else plan_obj

            progress = {
                "current_node": node_name or last_node,
                "mode": current_state.get("mode"),
                "needs_research": current_state.get("needs_research"),
                "evidence_count": len(current_state.get("evidence") or []),
                "tasks_total": len((plan_dict or {}).get("tasks", [])) if plan_dict else 0,
                "sections_done": len(current_state.get("sections") or []),
            }
            last_node = node_name or last_node

            blog.progress_json = json.dumps(progress, default=str)
            if plan_dict and not blog.title:
                blog.title = plan_dict.get("blog_title", "")[:255]
                blog.mode = current_state.get("mode", "")
                blog.blog_kind = plan_dict.get("blog_kind", "")
            db.commit()

        final_plan = current_state.get("plan")
        final_evidence = current_state.get("evidence") or []

        blog.plan_json = json.dumps(
            final_plan.model_dump() if isinstance(final_plan, Plan) else final_plan, default=str
        )
        blog.evidence_json = json.dumps(
            [e.model_dump() if isinstance(e, EvidenceItem) else e for e in final_evidence], default=str
        )
        blog.final_md = current_state.get("final") or ""
        blog.mode = current_state.get("mode", "")
        if isinstance(final_plan, Plan):
            blog.title = final_plan.blog_title[:255]
            blog.blog_kind = final_plan.blog_kind
        elif isinstance(final_plan, dict):
            blog.title = (final_plan.get("blog_title") or blog.title)[:255]
            blog.blog_kind = final_plan.get("blog_kind", blog.blog_kind)

        if not blog.title:
            blog.title = topic[:80]

        blog.status = "completed"
        db.commit()

    except Exception as e:  # noqa: BLE001
        db.rollback()
        blog = db.query(models.BlogPost).get(blog_id)
        if blog:
            blog.status = "failed"
            blog.error = str(e)[:2000]
            db.commit()
    finally:
        db.close()


@router.post("/generate", response_model=schemas.BlogListItem)
def generate_blog(
    payload: schemas.GenerateIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    as_of = payload.as_of or date.today().isoformat()

    blog = models.BlogPost(
        user_id=current_user.id,
        topic=payload.topic.strip(),
        as_of=as_of,
        status="queued",
        title="",
    )
    db.add(blog)
    db.commit()
    db.refresh(blog)

    background_tasks.add_task(run_generation, blog.id, blog.topic, as_of)

    return blog


@router.get("", response_model=list[schemas.BlogListItem])
def list_blogs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    blogs = (
        db.query(models.BlogPost)
        .filter(models.BlogPost.user_id == current_user.id)
        .order_by(models.BlogPost.created_at.desc())
        .all()
    )
    return blogs


def _get_owned_blog(blog_id: int, db: Session, current_user: models.User) -> models.BlogPost:
    blog = db.query(models.BlogPost).get(blog_id)
    if not blog or blog.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Blog not found.")
    return blog


@router.get("/{blog_id}", response_model=schemas.BlogDetail)
def get_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    blog = _get_owned_blog(blog_id, db, current_user)

    def _load(s):
        try:
            return json.loads(s) if s else None
        except Exception:
            return None

    return schemas.BlogDetail(
        id=blog.id,
        title=blog.title or blog.topic[:80],
        topic=blog.topic,
        status=blog.status,
        error=blog.error,
        mode=blog.mode,
        blog_kind=blog.blog_kind,
        as_of=blog.as_of,
        plan=_load(blog.plan_json),
        evidence=_load(blog.evidence_json) or [],
        final_md=blog.final_md,
        progress=_load(blog.progress_json),
        created_at=blog.created_at,
        updated_at=blog.updated_at,
    )


@router.delete("/{blog_id}")
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    blog = _get_owned_blog(blog_id, db, current_user)
    db.delete(blog)
    db.commit()
    return {"ok": True}


@router.get("/{blog_id}/download.md")
def download_markdown(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    blog = _get_owned_blog(blog_id, db, current_user)
    if not blog.final_md:
        raise HTTPException(status_code=400, detail="This blog has no generated content yet.")

    filename = f"{_safe_slug(blog.title or blog.topic)}.md"
    return Response(
        content=blog.final_md,
        media_type="text/markdown",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{blog_id}/bundle.zip")
def download_bundle(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    blog = _get_owned_blog(blog_id, db, current_user)
    if not blog.final_md:
        raise HTTPException(status_code=400, detail="This blog has no generated content yet.")

    md_filename = f"{_safe_slug(blog.title or blog.topic)}.md"

    buf = BytesIO()
    with zipfile.ZipFile(buf, "w", compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr(md_filename, blog.final_md.encode("utf-8"))
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{_safe_slug(blog.title or blog.topic)}_bundle.zip"'},
    )