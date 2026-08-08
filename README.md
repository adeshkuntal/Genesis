# Genesis — Automated Planning & Blog-Writing AI

> **Research. Plan. Write. Illustrate. Publish.**

Genesis is an AI-powered SaaS application that turns a topic into a complete, research-backed blog post through an automated six-stage LangGraph pipeline.

![Genesis Pipeline](https://img.shields.io/badge/Pipeline-Route%20%E2%86%92%20Research%20%E2%86%92%20Plan%20%E2%86%92%20Draft%20%E2%86%92%20Illustrate%20%E2%86%92%20Publish-0f766e)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind%20CSS-61dafb)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![AI](https://img.shields.io/badge/AI-LangGraph%20%7C%20Groq%20%7C%20Gemini-7c3aed)
![Database](https://img.shields.io/badge/Database-SQLite-003b57)

---

## Overview

**Genesis** is an automated AI blog-generation platform built around a multi-stage LangGraph workflow.

Instead of simply sending a prompt to an LLM and waiting for a response, Genesis operates as an autonomous content pipeline:

```text
Topic
  │
  ▼
┌─────────┐
│  Route  │  Decide whether live research is required
└────┬────┘
     ▼
┌──────────┐
│ Research │  Gather current web evidence when needed
└────┬─────┘
     ▼
┌────────┐
│  Plan  │  Build the complete article structure
└────┬───┘
     ▼
┌────────┐
│ Draft  │  Generate the article section by section
└────┬───┘
     ▼
┌────────────┐
│ Illustrate │  Generate and attach article images
└────┬───────┘
     ▼
┌─────────┐
│ Publish │  Assemble the final downloadable post
└─────────┘