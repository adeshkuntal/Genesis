import React from "react";
import { Link } from "react-router-dom";
import { Feather, Sparkles, GitBranch, Link2, ArrowRight } from "lucide-react";
import Logo from "../components/Logo.jsx";
import PipelinePath from "../components/PipelinePath.jsx";

const FEATURES = [
  {
    icon: GitBranch,
    title: "Router that decides for itself",
    body: "Genesis reads your topic and chooses closed-book, hybrid, or open-book mode — only reaching for live search when the subject actually needs it.",
  },
  {
    icon: Sparkles,
    title: "Planned before a word is written",
    body: "A full outline — audience, tone, sections, word targets — is drafted and locked before any prose gets generated.",
  },
  {
    icon: Feather,
    title: "Sections written in parallel",
    body: "Each section is assigned to its own writer pass, grounded in cited evidence where the topic calls for it.",
  },
  {
    icon: Link2,
    title: "Every claim has a source",
    body: "When a topic needs live research, Genesis attaches the evidence trail — every cited claim links back to the page it came from.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-panel-border/60 bg-ink/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-soft hover:text-ivory transition-colors px-3 py-2">
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium bg-teal hover:bg-teal-bright text-ink px-4 py-2 rounded-lg transition-colors"
            >
              Start writing free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-panel-border bg-panel/60 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-teal-bright mb-8 animate-rise">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-bright animate-pulse-soft" />
          Six-stage planning pipeline, watched live
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.08] tracking-tight text-ivory max-w-3xl mx-auto animate-rise" style={{ animationDelay: "80ms" }}>
          Give it a topic.
          <br />
          <span className="bg-gradient-to-r from-teal-bright to-gold-bright bg-clip-text text-transparent">
            Genesis plans, researches,
          </span>
          <br />
          and writes the post.
        </h1>

        <p className="mt-6 text-lg text-slate-soft max-w-xl mx-auto animate-rise" style={{ animationDelay: "160ms" }}>
          An AI agent that outlines a real editorial plan, pulls in live evidence when the
          topic demands it, drafts every section, and places its own diagrams — with the
          whole pipeline visible as it runs.
        </p>

        <div className="mt-9 flex items-center justify-center gap-4 animate-rise" style={{ animationDelay: "240ms" }}>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-teal hover:bg-teal-bright text-ink font-medium px-6 py-3 rounded-xl transition-colors shadow-glow"
          >
            Start writing free <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 border border-panel-border hover:border-slate-dim text-ivory px-6 py-3 rounded-xl transition-colors"
          >
            Log in
          </Link>
        </div>

        {/* Signature pipeline visual */}
        <div className="mt-20 mx-auto max-w-3xl rounded-2xl border border-panel-border bg-panel/50 p-8 shadow-panel animate-rise" style={{ animationDelay: "320ms" }}>
          <div className="text-left mb-6">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-dim">The Genesis pipeline</div>
            <div className="text-ivory font-display text-lg mt-0.5">Every post moves through the same six checkpoints</div>
          </div>
          <PipelinePath activeIndex={4} doneIndex={3} />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-panel-border bg-panel/40 p-6 hover:border-teal/30 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-teal/10 border border-teal/30 flex items-center justify-center mb-4">
                <Icon size={18} className="text-teal-bright" />
              </div>
              <h3 className="font-display text-lg text-ivory mb-2">{title}</h3>
              <p className="text-sm text-slate-soft leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="rounded-3xl border border-panel-border bg-genesis-glow bg-panel/50 px-8 py-14">
          <h2 className="font-display text-3xl text-ivory mb-3">Your next post is one topic away.</h2>
          <p className="text-slate-soft mb-8 max-w-md mx-auto">
            Create a free account and watch Genesis plan, research, and draft your first post in one run.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-teal hover:bg-teal-bright text-ink font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Create your account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-panel-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-dim">
          <Logo size="sm" />
          <span>© {new Date().getFullYear()} Genesis. Automated planning &amp; blog writing AI.</span>
        </div>
      </footer>
    </div>
  );
}
