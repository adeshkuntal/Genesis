import React from "react";
import AppLayout from "../components/AppLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Settings() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="text-xs font-mono uppercase tracking-wider text-teal-bright mb-1">Settings</div>
        <h1 className="font-display text-3xl text-ivory mb-8">Account</h1>

        <div className="rounded-2xl border border-panel-border bg-panel/50 p-6 space-y-5">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-dim mb-1.5">Name</div>
            <div className="text-ivory">{user?.name}</div>
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-dim mb-1.5">Email</div>
            <div className="text-ivory">{user?.email}</div>
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-dim mb-1.5">Plan</div>
            <span className="inline-block text-xs font-mono uppercase tracking-wider text-gold border border-gold/30 bg-gold/10 rounded-full px-2.5 py-1">
              {user?.plan || "Free"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-panel-border bg-panel/30 p-6 mt-6">
          <h2 className="font-display text-lg text-ivory mb-2">About Genesis</h2>
          <p className="text-sm text-slate-soft leading-relaxed">
            Genesis plans, researches, drafts, and illustrates technical blog posts through a
            six-stage pipeline: route, research, plan, draft, illustrate, and publish. Every post
            you generate is saved to your library with its full plan and evidence trail.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
