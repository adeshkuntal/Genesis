import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PenSquare, Search } from "lucide-react";
import AppLayout from "../components/AppLayout.jsx";
import BlogCard from "../components/BlogCard.jsx";
import { api } from "../api/client.js";

const FILTERS = ["all", "completed", "running", "failed"];

export default function Library() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .listBlogs()
      .then(setBlogs)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const statusOk =
        filter === "all" ||
        (filter === "running" && (b.status === "running" || b.status === "queued")) ||
        b.status === filter;
      const q = query.trim().toLowerCase();
      const queryOk = !q || (b.title || b.topic).toLowerCase().includes(q);
      return statusOk && queryOk;
    });
  }, [blogs, query, filter]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-teal-bright mb-1">Library</div>
            <h1 className="font-display text-3xl text-ivory">Everything Genesis has written for you.</h1>
          </div>
          <Link
            to="/new"
            className="inline-flex items-center gap-2 bg-teal hover:bg-teal-bright text-ink font-medium px-5 py-2.5 rounded-xl transition-colors shrink-0"
          >
            <PenSquare size={16} /> New blog
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-dim" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your posts…"
              className="w-full rounded-xl bg-panel/50 border border-panel-border pl-10 pr-4 py-2.5 text-sm text-ivory placeholder:text-slate-dim focus:border-teal outline-none"
            />
          </div>
          <div className="flex gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border transition-colors ${
                  filter === f
                    ? "border-teal/40 bg-teal/10 text-teal-bright"
                    : "border-panel-border text-slate-soft hover:text-ivory"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-slate-soft text-sm">Loading your posts…</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-panel-border p-12 text-center text-slate-soft text-sm">
            No posts match here yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
