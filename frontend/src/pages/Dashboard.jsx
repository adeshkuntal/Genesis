import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PenSquare, FileText, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import AppLayout from "../components/AppLayout.jsx";
import BlogCard from "../components/BlogCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-panel-border bg-panel/50 p-5">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 ${accent}`}>
        <Icon size={16} />
      </div>
      <div className="font-display text-2xl text-ivory">{value}</div>
      <div className="text-xs text-slate-soft mt-0.5">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listBlogs()
      .then(setBlogs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const completed = blogs.filter((b) => b.status === "completed").length;
  const running = blogs.filter((b) => b.status === "running" || b.status === "queued").length;
  const recent = blogs.slice(0, 6);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-teal-bright mb-1">Dashboard</div>
            <h1 className="font-display text-3xl text-ivory">
              Welcome back, {user?.name?.split(" ")[0] || "there"}.
            </h1>
          </div>
          <Link
            to="/new"
            className="inline-flex items-center gap-2 bg-teal hover:bg-teal-bright text-ink font-medium px-5 py-2.5 rounded-xl transition-colors shrink-0"
          >
            <PenSquare size={16} /> New blog
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <StatCard icon={FileText} label="Total posts" value={blogs.length} accent="bg-teal/10 text-teal-bright" />
          <StatCard icon={CheckCircle2} label="Completed" value={completed} accent="bg-gold/10 text-gold-bright" />
          <StatCard icon={Clock} label="In progress" value={running} accent="bg-panel-light text-slate-soft" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-ivory">Recent posts</h2>
          {blogs.length > 0 && (
            <Link to="/library" className="text-sm text-teal-bright hover:underline inline-flex items-center gap-1">
              View library <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-slate-soft text-sm">Loading your posts…</div>
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-panel-border p-12 text-center">
            <p className="text-slate-soft mb-4">You haven't written anything with Genesis yet.</p>
            <Link
              to="/new"
              className="inline-flex items-center gap-2 bg-teal hover:bg-teal-bright text-ink font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              <PenSquare size={16} /> Plan your first post
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
