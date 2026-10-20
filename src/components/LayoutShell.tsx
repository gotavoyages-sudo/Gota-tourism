"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GotaLogo } from "./GotaLogo";

const nav = [
  { href: "/", label: "Dashboard", icon: "◇" },
  { href: "/trips", label: "Trips & Clients", icon: "◉" },
  { href: "/itinerary", label: "Itinerary Builder", icon: "≡" },
  { href: "/hotels", label: "Hotels & Apartments", icon: "⌂" },
  { href: "/restaurants", label: "Restaurants & Meals", icon: "☽" },
  { href: "/transport", label: "Transportation", icon: "⇄" },
  { href: "/activities", label: "Tours & Activities", icon: "✦" },
  { href: "/quotations", label: "Quotations", icon: "⧉" },
  { href: "/proposal", label: "Client Proposal / PDF", icon: "❖" },
  { href: "/vouchers", label: "Booking Vouchers", icon: "▭" },
  { href: "/payments", label: "Payments", icon: "₦" },
  { href: "/profit", label: "Internal Profit", icon: "◈" },
  { href: "/whatsapp", label: "WhatsApp Generator", icon: "✆" },
  { href: "/documents", label: "Document Centre", icon: "⎙" },
  { href: "/master", label: "Master Data", icon: "⚙" },
  { href: "/settings", label: "Settings & Admin", icon: "⚑" },
];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "FR">("EN");

  const isLogin = pathname === "/login";
  const isProposal = pathname.startsWith("/proposal");

  if (isLogin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  if (isProposal) {
    return (
      <div className="min-h-screen bg-white text-[#111]">
        <div className="sticky top-0 z-20 bg-[#0a0a0a] text-white px-4 lg:px-8 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8">
              <GotaLogo size={32} />
            </div>
            <div className="font-serif font-bold text-sm">GOTA VOYAGES</div>
            <span className="text-xs text-[#EE8A1D]">Client Proposal Preview</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="bg-[#EE8A1D] text-black px-4 py-2 rounded-full text-sm font-semibold">⎙ Download / Print PDF</button>
            <Link href="/trips" className="bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm">← Back to Operations</Link>
          </div>
        </div>
        <main>{children}</main>
      </div>
    );
  }

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-[#0c0c0c] border-r border-[#EE8A1D]/20 flex flex-col transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} lg:static`}>
        <div className="p-5 border-b border-[#EE8A1D]/20 flex items-center gap-3">
          <div className="w-12 h-10 flex items-center justify-center">
            <GotaLogo size={44} />
          </div>
          <div>
            <div className="font-serif text-[15px] font-bold tracking-wide leading-tight">GOTA VOYAGES</div>
            <div className="text-[9px] tracking-[0.22em] text-[#EE8A1D] uppercase">Expert Through Experience</div>
          </div>
        </div>

        <div className="px-4 pt-4 pb-2 flex gap-2 items-center">
          <button onClick={() => setLang("EN")} className={`text-[10px] px-3 py-1 rounded-full border ${lang === "EN" ? "bg-[#EE8A1D] text-black border-[#EE8A1D] font-semibold" : "border-white/20 text-white/70"}`}>EN</button>
          <button onClick={() => setLang("FR")} className={`text-[10px] px-3 py-1 rounded-full border ${lang === "FR" ? "bg-[#EE8A1D] text-black border-[#EE8A1D] font-semibold" : "border-white/20 text-white/70"}`}>FR</button>
          <span className="ml-auto text-[10px] text-white/40 pt-1">+229 01 96 87 05 29</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${active ? "bg-[#EE8A1D] text-black font-semibold" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                <span className="w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0c0c0c] rounded-xl p-4 border border-[#EE8A1D]/20">
            <div className="text-[10px] text-[#EE8A1D] font-semibold tracking-widest uppercase">GOTA International Group</div>
            <div className="text-[11px] text-white/70 mt-1 leading-snug">Tourism Operations • Finance • Reservations</div>
            <div className="mt-2 text-[10px] bg-black/60 rounded-lg px-2 py-1.5 text-white/80 font-mono">tourisme@gotainternational.com</div>
            <div className="text-[10px] bg-black/60 rounded-lg px-2 py-1.5 text-white/80 font-mono mt-1">+229 01 96 87 05 29</div>
          </div>
          <button onClick={logout} className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[11px] py-2 rounded-lg flex items-center justify-center gap-2">⎋ Log Out</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur border-b border-white/10 flex items-center justify-between px-4 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(!open)} className="lg:hidden w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">☰</button>
            <div className="hidden lg:block text-sm text-white/60">GOTA Voyages <span className="text-[#EE8A1D]">|</span> GOTA International Group · Internal Operations</div>
            <div className="lg:hidden font-serif font-bold">GOTA</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[11px] bg-[#EE8A1D] text-black px-3 py-1.5 rounded-full font-semibold">● Staff Signed In</div>
            <Link href="/proposal" className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">Client PDF</Link>
            <Link href="/trips" className="bg-[#EE8A1D] text-black px-4 py-2 rounded-full text-sm font-semibold">+ New Trip</Link>
          </div>
        </header>
        <main className="flex-1 bg-[#f8f5ee] text-[#111] rounded-t-3xl lg:rounded-tl-3xl mt-2 overflow-hidden">
          <div className="min-h-[calc(100vh-60px)] p-4 lg:p-8">{children}</div>
        </main>
      </div>
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/60 z-30 lg:hidden"></div>}
    </div>
  );
}
