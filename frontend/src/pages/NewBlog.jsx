import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import AppLayout from "../components/AppLayout.jsx";
import PipelinePath from "../components/PipelinePath.jsx";
import { api } from "../api/client.js";

const EXAMPLES = [
  "How transformer attention actually works, for backend engineers",
  "This week in AI agent frameworks",
  "LangGraph vs. plain function calling for multi-agent systems",
  "A practical guide to RAG evaluation metrics",
];

export default function NewBlog() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [asOf, setAsOf] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setError("");
    setLoading(true);
    try {
      const blog = await api.generateBlog({ topic: topic.trim(), as_of: asOf });
      navigate(`/blog/${blog.id}`);
    } catch (err) {
      setError(err.message || "Could not start generation.");
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-xs font-mono uppercase tracking-wider text-teal-bright mb-1">New blog</div>
        <h1 className="font-display text-3xl text-ivory mb-2">What should Genesis write about?</h1>
        <p className="text-slate-soft mb-8">
          Give it a topic — as specific or open-ended as you like. Genesis will decide on its own
          whether it needs to research first.
        </p>

        <form onSubmit={onSubmit} className="rounded-2xl border border-panel-border bg-panel/50 p-6 shadow-panel">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-dim mb-2">Topic</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={4}
            placeholder="e.g. Why RAG pipelines fail in production, and how to debug them"
            className="w-full rounded-xl bg-ink border border-panel-border px-4 py-3 text-sm text-ivory placeholder:text-slate-dim focus:border-teal outline-none resize-none"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                type="button"
                key={ex}
                onClick={() => setTopic(ex)}
                className="text-xs text-slate-soft border border-panel-border hover:border-teal/40 hover:text-teal-bright rounded-full px-3 py-1.5 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-dim mb-1.5">As-of date</label>
              <input
                type="date"
                value={asOf}
                onChange={(e) => setAsOf(e.target.value)}
                className="w-full sm:w-auto rounded-lg bg-ink border border-panel-border px-3.5 py-2.5 text-sm text-ivory focus:border-teal outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-bright disabled:opacity-60 text-ink font-medium px-6 py-2.5 rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Starting…
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Generate blog <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
        </form>

        <div className="mt-8 rounded-2xl border border-panel-border bg-panel/30 p-6">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-dim mb-4">What happens next</div>
          <PipelinePath activeIndex={-1} doneIndex={-1} compact />
        </div>
      </div>
    </AppLayout>
  );
}
