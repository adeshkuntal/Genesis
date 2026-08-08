import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, FileText } from "lucide-react";
import StatusPill from "./StatusPill.jsx";

export default function BlogCard({ blog }) {
  const date = new Date(blog.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      to={`/blog/${blog.id}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-panel-border bg-panel/60 p-5 shadow-panel transition-all hover:border-teal/40 hover:-translate-y-0.5"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <FileText size={18} className="text-gold shrink-0 mt-1" />
          <StatusPill status={blog.status} />
        </div>
        <h3 className="mt-3 font-display text-lg text-ivory leading-snug line-clamp-2">
          {blog.title || blog.topic}
        </h3>
        <p className="mt-1.5 text-sm text-slate-soft line-clamp-2">{blog.topic}</p>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-dim">
        <span>{date}</span>
        {blog.blog_kind && (
          <span className="uppercase tracking-wider text-teal-bright/80">{blog.blog_kind.replace("_", " ")}</span>
        )}
      </div>
      <ArrowUpRight
        size={16}
        className="absolute right-5 top-5 text-slate-dim opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </Link>
  );
}
