import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, PenSquare, Library, Settings, LogOut } from "lucide-react";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/new", label: "New Blog", icon: PenSquare },
  { to: "/library", label: "Library", icon: Library },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col border-r border-panel-border bg-ink-soft/60 backdrop-blur-sm px-4 py-6">
      <div className="px-2 mb-8">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 space-y-1">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-teal/10 text-teal-bright border border-teal/30"
                  : "text-slate-soft border border-transparent hover:text-ivory hover:bg-panel-light",
              ].join(" ")
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 border-t border-panel-border pt-4">
        <div className="px-3 mb-3">
          <div className="text-sm text-ivory font-medium truncate">{user?.name}</div>
          <div className="text-xs text-slate-dim truncate">{user?.email}</div>
          <span className="inline-block mt-2 text-[10px] font-mono uppercase tracking-wider text-gold border border-gold/30 bg-gold/10 rounded-full px-2 py-0.5">
            {user?.plan || "Free"} plan
          </span>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-soft hover:text-red-400 hover:bg-red-500/5 transition-colors"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
