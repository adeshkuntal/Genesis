from __future__ import annotations

from functools import lru_cache

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq

# All LLM clients are built lazily (only on first call) so importing this
# module - or anything that imports it, including the whole FastAPI app -
# never requires API keys to be present. Keys are only needed the moment a
# generation actually runs.


@lru_cache(maxsize=1)
def get_llm():
    return ChatGoogleGenerativeAI(model="gemini-2.5-flash")


@lru_cache(maxsize=1)
def get_router_llm():
    return ChatGroq(model="llama-3.1-8b-instant", temperature=0)


@lru_cache(maxsize=1)
def get_research_llm():
    return ChatGoogleGenerativeAI(model="gemini-2.5-flash")


@lru_cache(maxsize=1)
def get_planner_llm():
    return ChatGroq(model="llama-3.3-70b-versatile", temperature=0)


@lru_cache(maxsize=1)
def get_writer_llm():
    return ChatGoogleGenerativeAI(model="gemini-2.5-flash")


@lru_cache(maxsize=1)
def get_concept_llm():
    """Used by the visuals pipeline's Concept Extractor stage - a fast,
    cheap model is fine since this is a narrow extraction task."""
    return ChatGroq(model="llama-3.3-70b-versatile", temperature=0)


@lru_cache(maxsize=1)
def get_visual_planner_llm():
    """Used by the visuals pipeline's Visualization Planner stage."""
    return ChatGroq(model="llama-3.3-70b-versatile", temperature=0)