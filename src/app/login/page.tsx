"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GotaLogo } from "@/components/GotaLogo";

export default function LoginPage() {
  const [email, setEmail] = useState("tourisme@gotainternational.com");
  const [password, setPassword] = useState("Gota2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated; if yes, send to dashboard
    fetch("/api/auth", { credentials: "include" })
      .then(r => r.json())
      .then(j => { if (j.authenticated) window.location.replace("/"); });
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setInfo("Signing in…");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });
      const j = await res.json();
      if (!res.ok) { setError(j.error || "Login failed"); setInfo(""); setLoading(false); return; }
      setInfo("✓ Signed in. Loading dashboard…");
      // Hard redirect (not client router) to ensure cookie + auth re-check
      window.location.href = "/";
    } catch (err: any) {
      setError("Network error. Please try again.");
      setInfo("");
      setLoading(false);
    }
  };

  const resetDefault = async () => {
    if (!confirm("Reset single login to default (tourisme@gotainternational.com / Gota2026!)?")) return;
    setLoading(true); setError(""); setInfo("Resetting…");
    const res = await fetch("/api/auth", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset_default" }),
    });
    const j = await res.json();
    if (res.ok) {
      setEmail("tourisme@gotainternational.com");
      setPassword("Gota2026!");
      setInfo("✓ Reset successful. Click Sign in.");
    } else {
      setError(j.error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-stretch bg-[#0a0a0a] rounded-[32px] overflow-hidden border border-[#EE8A1D]/20 shadow-[0_40px_120px_rgba(238,138,29,0.08)]">
      {/* Left brand panel */}
      <div className="relative bg-gradient-to-br from-[#000] via-[#0c0c0c] to-[#1a0e00] p-10 lg:p-12 text-white flex flex-col">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{background:"radial-gradient(ellipse at top right, #EE8A1D 0%, transparent 60%)"}}></div>
        <div className="relative flex items-start gap-4">
          <div className="w-20 h-16"><GotaLogo size={80} /></div>
        </div>
        <div className="relative mt-10">
          <div className="text-[10px] tracking-[0.3em] text-[#EE8A1D] font-semibold">GOTA VOYAGES</div>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold leading-tight mt-2">Tourism Operations Portal</h1>
          <p className="text-sm text-white/60 mt-3 leading-relaxed max-w-sm">Authorized staff access only. Trips, premium itineraries, quotations, bookings, payments and profit reconciliation — one secure system.</p>
          <div className="mt-8 space-y-3">
            {[
              "Single staff login",
              "Premium client proposals (EN / FR)",
              "Editable service-level profit",
              "Versioned quotations & vouchers",
              "PDF download directly to client",
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-[#EE8A1D] text-black flex items-center justify-center font-bold text-[10px]">✓</span>
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mt-auto pt-10 text-[11px] text-white/40 space-y-0.5">
          <div>tourisme@gotainternational.com</div>
          <div>+229 01 96 87 05 29</div>
          <div className="mt-2">© GOTA International Group — Cotonou · Lomé · Lagos</div>
        </div>
      </div>

      {/* Right form */}
      <div className="bg-white p-8 lg:p-12 flex flex-col">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EE8A1D]"></div>
          <span className="text-[10px] tracking-[0.25em] text-[#888] font-semibold">STAFF ACCESS • ONE LOGIN</span>
        </div>
        <h2 className="font-serif text-3xl font-bold mt-4 text-[#0a0a0a]">Sign in</h2>
        <p className="text-sm text-[#6b6b6b] mt-1">Use your GOTA International staff credentials.</p>

        <form onSubmit={login} className="mt-8 space-y-5">
          <div>
            <label className="text-[10px] font-semibold tracking-widest uppercase text-[#0a0a0a]">Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
              className="mt-2 w-full px-4 py-3 rounded-2xl border border-black/10 bg-[#fcfaf6] focus:outline-none focus:border-[#EE8A1D] focus:ring-4 focus:ring-[#EE8A1D]/10 text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-widest uppercase text-[#0a0a0a]">Password</label>
            <div className="mt-2 relative">
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 pr-20 rounded-2xl border border-black/10 bg-[#fcfaf6] focus:outline-none focus:border-[#EE8A1D] focus:ring-4 focus:ring-[#EE8A1D]/10 text-sm"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-white border border-black/10 px-3 py-1 rounded-full">{show ? "Hide" : "Show"}</button>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-2xl">⚠️ {error}</div>}
          {info && !error && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3 rounded-2xl">{info}</div>}

          <button type="submit" disabled={loading} className="w-full bg-[#0a0a0a] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-black transition flex items-center justify-center gap-3">
            {loading ? "Signing in…" : <>Sign in <span className="w-6 h-6 rounded-full bg-[#EE8A1D] flex items-center justify-center text-black text-xs">→</span></>}
          </button>

          <div className="bg-[#fcfaf6] border border-[#EE8A1D]/20 rounded-2xl p-4">
            <div className="text-[11px] font-semibold text-[#0a0a0a]">Default credentials</div>
            <div className="text-[11px] text-[#6b6b6b] mt-1 leading-relaxed">
              <div><b>Email:</b> tourisme@gotainternational.com</div>
              <div><b>Password:</b> Gota2026! <span className="text-[#9a9a9a]">(capital G, ends with !)</span></div>
            </div>
            <button type="button" onClick={resetDefault} className="mt-3 w-full bg-white border border-[#EE8A1D]/30 text-[#EE8A1D] py-2 rounded-full text-xs font-semibold hover:bg-[#fff8ef]">↺ Fill / reset to default login</button>
            <div className="text-[10px] text-[#9a9a9a] mt-2 text-center">If sign-in keeps failing, clear site cookies or open in a private window.</div>
          </div>
        </form>

        <div className="mt-auto pt-6 text-center">
          <div className="text-[10px] text-[#9a9a9a]">Internal staff system only. Unauthorised access prohibited.</div>
        </div>
      </div>
    </div>
  );
}
