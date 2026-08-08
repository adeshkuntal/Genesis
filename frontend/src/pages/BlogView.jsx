import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Package, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import AppLayout from "../components/AppLayout.jsx";
import PipelinePath, { progressToIndices } from "../components/PipelinePath.jsx";
import MarkdownRenderer from "../components/MarkdownRenderer.jsx";
import StatusPill from "../components/StatusPill.jsx";
import { api } from "../api/client.js";

const TABS = ["Preview", "Plan", "Evidence"];

export default function BlogView() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [tab, setTab] = useState("Preview");
  const [notFound, setNotFound] = useState(false);
  const pollRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const fetchBlog = async () => {
      try {
        const data = await api.getBlog(id);
        if (cancelled) return;
        setBlog(data);
        if (data.status === "completed" || data.status === "failed") {
          clearInterval(pollRef.current);
        }
      } catch (err) {
        if (!cancelled) setNotFound(true);
        clearInterval(pollRef.current);
      }
    };

    fetchBlog();
    pollRef.current = setInterval(fetchBlog, 2200);

    return () => {
      cancelled = true;
      clearInterval(pollRef.current);
    };
  }, [id]);

  if (notFound) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <AlertCircle className="mx-auto text-slate-dim mb-4" size={28} />
          <p className="text-slate-soft">This post doesn't exist, or isn't yours to view.</p>
          <Link to="/library" className="text-teal-bright hover:underline text-sm mt-3 inline-block">
            Back to library
          </Link>
        </div>
      </AppLayout>
    );
  }

  if (!blog) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 rounded-full border-2 border-teal border-t-transparent animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const isRunning = blog.status === "queued" || blog.status === "running";
  const { activeIndex, doneIndex } = progressToIndices(blog.status, blog.progress);

  const onDelete = async () => {
    if (!confirm("Delete this post? This can't be undone.")) return;
    await api.deleteBlog(id);
    window.location.href = "/library";
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <StatusPill status={blog.status} />
              {blog.blog_kind && (
                <span className="text-xs font-mono uppercase tracking-wider text-slate-dim">
                  {blog.blog_kind.replace("_", " ")}
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl md:text-3xl text-ivory leading-snug break-words">
              {blog.title || blog.topic}
            </h1>
          </div>

          {blog.status === "completed" && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  api
                    .downloadFile(api.downloadUrl(blog.id), `${blog.title || "blog"}.md`)
                    .catch((err) => alert(err.message))
                }
                className="inline-flex items-center gap-1.5 text-sm border border-panel-border hover:border-teal/40 hover:text-teal-bright text-ivory px-3.5 py-2 rounded-lg transition-colors"
              >
                <Download size={15} /> Markdown
              </button>
              <button
                onClick={() =>
                  api
                    .downloadFile(api.bundleUrl(blog.id), `${blog.title || "blog"}_bundle.zip`)
                    .catch((err) => alert(err.message))
                }
                className="inline-flex items-center gap-1.5 text-sm border border-panel-border hover:border-teal/40 hover:text-teal-bright text-ivory px-3.5 py-2 rounded-lg transition-colors"
              >
                <Package size={15} /> Bundle
              </button>
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 text-sm border border-panel-border hover:border-red-400/40 hover:text-red-400 text-slate-soft px-3 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Live pipeline */}
        {(isRunning || blog.status === "failed") && (
          <div className="rounded-2xl border border-panel-border bg-panel/50 p-6 mb-8">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-dim mb-5">
              {isRunning ? "Generating your post…" : "Generation stopped"}
            </div>
            <PipelinePath activeIndex={activeIndex} doneIndex={doneIndex} failed={blog.status === "failed"} />
            {blog.progress && isRunning && (
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <MiniStat label="Mode" value={blog.progress.mode || "…"} />
                <MiniStat label="Evidence" value={blog.progress.evidence_count ?? 0} />
                <MiniStat label="Sections" value={`${blog.progress.sections_done ?? 0}/${blog.progress.tasks_total ?? 0}`} />
              </div>
            )}
            {blog.status === "failed" && blog.error && (
              <p className="mt-5 text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3.5 py-2.5">
                {blog.error}
              </p>
            )}
          </div>
        )}

        {blog.status === "completed" && (
          <>
            <div className="flex gap-1 border-b border-panel-border mb-6 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                    tab === t ? "border-teal text-teal-bright" : "border-transparent text-slate-soft hover:text-ivory"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "Preview" && (
              <div className="rounded-2xl border border-panel-border bg-panel/30 p-6 md:p-10">
                <MarkdownRenderer markdown={blog.final_md} />
              </div>
            )}

            {tab === "Plan" && <PlanTab plan={blog.plan} />}
            {tab === "Evidence" && <EvidenceTab evidence={blog.evidence} />}
          </>
        )}
      </div>
    </AppLayout>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-panel-border bg-ink/40 py-3">
      <div className="font-mono text-sm text-teal-bright">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-dim mt-0.5">{label}</div>
    </div>
  );
}

function PlanTab({ plan }) {
  if (!plan) return <EmptyState text="No plan was recorded for this post." />;
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-panel-border bg-panel/30 p-6 grid sm:grid-cols-3 gap-4">
        <Field label="Audience" value={plan.audience} />
        <Field label="Tone" value={plan.tone} />
        <Field label="Kind" value={(plan.blog_kind || "").replace("_", " ")} />
      </div>
      <div className="space-y-3">
        {(plan.tasks || []).map((t) => (
          <div key={t.id} className="rounded-xl border border-panel-border bg-panel/30 p-5">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="font-display text-ivory">{t.title}</h4>
              <span className="text-xs font-mono text-slate-dim">~{t.target_words}w</span>
            </div>
            <p className="text-sm text-slate-soft mb-3">{t.goal}</p>
            <ul className="list-disc list-inside text-sm text-slate-soft space-y-1">
              {(t.bullets || []).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvidenceTab({ evidence }) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="space-y-3">
      {evidence.map((e, i) => (
        <a
          key={i}
          href={e.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-start justify-between gap-4 rounded-xl border border-panel-border bg-panel/30 p-4 hover:border-teal/30 transition-colors"
        >
          <div className="min-w-0">
            <div className="text-ivory text-sm font-medium truncate">
              {e.title || e.url}
            </div>

            <div className="text-xs text-slate-dim mt-1 truncate">
              {e.url}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs text-slate-dim">
            {e.published_at && (
              <span className="font-mono">{e.published_at}</span>
            )}
            <ExternalLink size={13} />
          </div>
        </a>
      ))}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-dim mb-1">{label}</div>
      <div className="text-sm text-ivory capitalize">{value}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-panel-border p-12 text-center text-slate-soft text-sm">
      {text}
    </div>
  );
}