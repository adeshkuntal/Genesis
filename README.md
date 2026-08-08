# Genesis — Automated Planning & Blog-Writing AI

Genesis takes a topic, decides for itself whether it needs live research, plans a
full outline, writes every section, places its own diagrams, and hands you a
finished, downloadable blog post — all visible as a live six-stage pipeline
(Route → Research → Plan → Draft → Illustrate → Publish).

This is a full SaaS-style app: React/Tailwind frontend + FastAPI backend, with
accounts, a saved library of past posts, and live generation progress. The
generation engine itself is your original LangGraph pipeline (`bwa_backend.py`),
adapted to run per-user behind a web API.

```
genesis/
├── backend/     FastAPI + SQLite + the LangGraph pipeline
└── frontend/    React + Vite + Tailwind CSS
```

## 1. Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
copy .env.example .env         # Windows: copy | macOS/Linux: cp
```

Open `.env` and fill in:

```
GENESIS_SECRET_KEY=some-long-random-string
GOOGLE_API_KEY=...     # Gemini — used for planning images + fallback LLM
GROQ_API_KEY=...       # Groq — used for routing/planning/writing
TAVILY_API_KEY=...     # Tavily — used for live web research
```

Run the API:

```bash
python run.py
```

The API is now live at `http://localhost:8000` (interactive docs at
`http://localhost:8000/docs`). It creates its own SQLite database
(`app/genesis.db`) on first run — no separate database server needed.

> Note: without API keys set, the app still boots and auth/signup/login/library
> all work — only the "Generate" step will fail (with a clear error surfaced in
> the UI) until keys are added.

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. The dev server proxies `/api` and `/static`
requests to the backend on port 8000, so both must be running together.

## 3. Using Genesis

1. Create an account (or log in).
2. Go to **New Blog**, describe a topic, and submit.
3. You're dropped onto the blog's live page, which polls the backend every
   ~2 seconds and animates the pipeline stepper as each stage completes.
4. Once finished, switch between **Preview / Plan / Evidence / Images** tabs,
   and download the post as Markdown or as a zip bundle (markdown + images).
5. **Library** lists every post you've generated, with search and status
   filters. **Dashboard** shows quick stats and your most recent posts.

## 4. Production notes

- Swap `GENESIS_SECRET_KEY` for a real random secret before deploying.
- `frontend`: run `npm run build` and serve the `dist/` folder from any static
  host (or behind the same reverse proxy as the API, mapping `/api` and
  `/static` through to the FastAPI process).
- `backend`: run behind `uvicorn`/`gunicorn` with a process manager; the SQLite
  file works for a single instance — swap the `sqlalchemy` connection string
  in `app/database.py` for Postgres/MySQL if you need to scale to multiple
  backend processes.
- Generated images are written to `backend/app/static/images/<blog_id>/` and
  served at `/static/images/<blog_id>/<filename>` — back this directory up (or
  point it at object storage) if you move to multiple backend instances.

## 5. What's under the hood

- `backend/app/engine/pipeline.py` is your original LangGraph graph
  (router → research → orchestrator → fan-out workers → reducer/images),
  changed only so images write to a per-blog folder instead of a shared one,
  and so the LLM clients are constructed lazily (the app now boots cleanly
  even before API keys are configured).
- `backend/app/routers/blogs.py` runs that graph in a background task per
  request, streaming `stream_mode="updates"` and writing a progress snapshot
  to the database after every node — that's what the frontend polls to
  animate the pipeline stepper live.
