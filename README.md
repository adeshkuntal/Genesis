# Genesis — Automated Planning & Blog-Writing AI

> **Research. Plan. Write. Publish.**

Genesis is an AI-powered SaaS application that transforms a topic into a
complete, structured blog post using an autonomous LangGraph workflow.

Instead of relying on a single LLM call, Genesis intelligently decides whether
live research is required, creates a structured writing plan, generates
individual sections in parallel, and merges the results into a finished blog.

---

## ✨ Features

- 🤖 **Autonomous blog generation**
- 🧠 **LangGraph-powered workflow orchestration**
- 🔎 **Optional live web research**
- ⚡ **Parallel section generation**
- 📚 **Personal blog library**
- 🔐 **User authentication**
- 📊 **Dashboard with generation statistics**
- 📈 **Live generation progress**
- 🔍 **Research evidence and sources**
- 📝 **Structured article planning**
- 📦 **Markdown and ZIP downloads**
- 🗂️ **Per-user saved blog history**
- 🖼️ **Generated article illustrations**
- ⚙️ **FastAPI REST backend**
- 🎨 **React + Tailwind CSS frontend**

---

# 🧠 Genesis Blog-Writing Pipeline

The core of Genesis is a **LangGraph-based blog-generation pipeline**.

The actual workflow is:

```text
                    ┌──────────┐
                    │  Router  │
                    └────┬─────┘
                         │
                    Research?
                    ┌────┴────┐
                    │         │
                   Yes        No
                    │         │
                    ▼         │
               ┌──────────┐   │
               │ Research │   │
               └────┬─────┘   │
                    │         │
                    └────┬────┘
                         ▼
                 ┌─────────────┐
                 │ Orchestrator│
                 └──────┬──────┘
                        │
                     Fan-out
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
     ┌────────┐    ┌────────┐    ┌────────┐
     │Worker 1│    │Worker 2│    │Worker N│
     └────┬───┘    └────┬───┘    └────┬───┘
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                ┌──────────────┐
                │ merge_content│
                └──────┬───────┘
                       ▼
                  Final Blog