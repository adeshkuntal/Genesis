import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Logo size="lg" />
          </Link>
        </div>

        <div className="rounded-2xl border border-panel-border bg-panel/50 p-7 shadow-panel">
          <h1 className="font-display text-2xl text-ivory mb-1">Create your account</h1>
          <p className="text-sm text-slate-soft mb-6">Plan and publish your first post in minutes.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-dim mb-1.5">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-ink border border-panel-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-slate-dim focus:border-teal outline-none"
                placeholder="Adesh"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-dim mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-ink border border-panel-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-slate-dim focus:border-teal outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-dim mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-ink border border-panel-border px-3.5 py-2.5 text-sm text-ivory placeholder:text-slate-dim focus:border-teal outline-none"
                placeholder="At least 6 characters"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-bright disabled:opacity-60 text-ink font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create account <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-soft mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-bright hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
