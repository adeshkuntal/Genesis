import React from "react";

const STYLES = {
  queued: "bg-panel-light text-slate-soft border-panel-border",
  running: "bg-teal/10 text-teal-bright border-teal/40",
  completed: "bg-teal/15 text-teal-bright border-teal/50",
  failed: "bg-red-500/10 text-red-400 border-red-500/40",
};

const LABELS = {
  queued: "Queued",
  running: "Generating",
  completed: "Ready",
  failed: "Failed",
};

export default function StatusPill({ status }) {
  const style = STYLES[status] || STYLES.queued;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[11px] uppercase tracking-wider ${style}`}>
      {status === "running" && <span className="h-1.5 w-1.5 rounded-full bg-teal-bright animate-pulse-soft" />}
      {LABELS[status] || status}
    </span>
  );
}
