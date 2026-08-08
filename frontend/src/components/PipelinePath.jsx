import React from "react";
import { Compass, SearchCheck, ListTree, PenLine, BookOpenCheck } from "lucide-react";

export const STAGES = [
  { key: "router", label: "Route", icon: Compass, desc: "Decide research depth" },
  { key: "research", label: "Research", icon: SearchCheck, desc: "Gather live evidence" },
  { key: "plan", label: "Plan", icon: ListTree, desc: "Outline every section" },
  { key: "draft", label: "Draft", icon: PenLine, desc: "Write sections in parallel" },
  { key: "publish", label: "Publish", icon: BookOpenCheck, desc: "Assemble final post" },
];

export default function PipelinePath({ activeIndex = -1, doneIndex = -1, failed = false, compact = false }) {
  return (
    <div className="w-full">
      <div className="relative flex items-start justify-between">
        <div className="absolute left-0 right-0 top-5 h-px bg-panel-border" />
        <div
          className="absolute left-0 top-5 h-px bg-quill-line transition-all duration-700 ease-out"
          style={{
            width: doneIndex >= 0 ? `${(doneIndex / (STAGES.length - 1)) * 100}%` : "0%",
          }}
        />
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const isDone = i <= doneIndex;
          const isActive = i === activeIndex && !isDone;
          const state = failed && isActive ? "failed" : isDone ? "done" : isActive ? "active" : "pending";

          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center" style={{ width: `${100 / STAGES.length}%` }}>
              <div
                className={[
                  "flex items-center justify-center rounded-full border transition-all duration-300",
                  compact ? "h-8 w-8" : "h-10 w-10",
                  state === "done" && "bg-teal border-teal text-ink",
                  state === "active" && "bg-panel border-teal text-teal shadow-glow animate-pulse-soft",
                  state === "failed" && "bg-panel border-red-400 text-red-400",
                  state === "pending" && "bg-panel border-panel-border text-slate-dim",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Icon size={compact ? 14 : 16} strokeWidth={2.2} />
              </div>
              {!compact && (
                <div className="mt-2 text-center">
                  <div className={`font-mono text-[11px] uppercase tracking-wider ${state === "pending" ? "text-slate-dim" : "text-ivory"}`}>
                    {stage.label}
                  </div>
                  <div className="hidden md:block text-[11px] text-slate-soft mt-0.5 max-w-[110px]">{stage.desc}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function progressToIndices(status, progress) {
  if (!progress) {
    return status === "completed"
      ? { activeIndex: STAGES.length - 1, doneIndex: STAGES.length - 1 }
      : { activeIndex: 0, doneIndex: -1 };
  }

  const node = progress.current_node;
  const mapNodeToStage = {
    router: 0,
    research: 1,
    orchestrator: 2,
    worker: 3,
    merge_content: 4,
  };

  if (status === "completed") return { activeIndex: STAGES.length - 1, doneIndex: STAGES.length - 1 };
  if (status === "failed") {
    const idx = mapNodeToStage[node] ?? 0;
    return { activeIndex: idx, doneIndex: idx - 1 };
  }

  const idx = node in mapNodeToStage ? mapNodeToStage[node] : 0;
  const skippedResearch = progress.needs_research === false;
  const doneIndex = skippedResearch ? Math.max(idx - 1, 1) : idx - 1;

  return { activeIndex: idx, doneIndex };
}