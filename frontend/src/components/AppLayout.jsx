import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PenSquare, Library, Settings, Menu, X } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import Logo from "./Logo.jsx";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/new", label: "New Blog", icon: PenSquare },
  { to: "/library", label: "Library", icon: Library },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-ink">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-panel-border">
          <Logo size="sm" />
          <button onClick={() => setOpen((v) => !v)} className="text-ivory p-2">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-b border-panel-border bg-ink-soft px-4 py-3 space-y-1">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                    isActive ? "bg-teal/10 text-teal-bright" : "text-slate-soft",
                  ].join(" ")
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </div>
        )}

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
