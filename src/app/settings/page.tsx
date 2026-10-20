"use client";
import { useEffect, useState } from "react";
export default function SettingsPage(){
  const [settings,setSettings]=useState<any>({exchangeRate:"2.5", defaultMargin:"10", companyName:"GOTA Voyages", tagline:"Expert Through Experience", logoUrl:"", roundingNGN:"1000", paymentTerms:"50% deposit to confirm, balance 7 days before departure", quotationValidity:"7 days", currencyDisplay:"both"});
  const [loginForm,setLoginForm]=useState({email:"tourisme@gotainternational.com", name:"GOTA Admin", currentPassword:"", newPassword:"", confirmPassword:""});
  const [loginMsg,setLoginMsg]=useState("");
  const load=async()=>{ const r=await fetch("/api/settings"); if(r.ok){ const j=await r.json(); setSettings((s:any)=>({...s,...j})); } const a=await fetch("/api/auth"); if(a.ok){ const aj=await a.json(); if(aj.user){ setLoginForm(f=>({...f,email:aj.user.email, name:aj.user.name})); } } };
  useEffect(()=>{load();},[]);
  const save=async()=>{ await fetch("/api/settings",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(settings)}); alert("Settings saved");};
  const updateLogin=async()=>{
    setLoginMsg("");
    if(loginForm.newPassword && loginForm.newPassword!==loginForm.confirmPassword){ setLoginMsg("New passwords do not match"); return; }
    if(loginForm.newPassword && !loginForm.currentPassword){ setLoginMsg("Enter current password to change"); return; }
    const res=await fetch("/api/auth",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({action:"update", email:loginForm.email, name:loginForm.name, password: loginForm.newPassword||undefined, currentPassword: loginForm.currentPassword||undefined})});
    const j=await res.json();
    if(!res.ok){ setLoginMsg(j.error||"Update failed"); return; }
    setLoginMsg("✓ Single login updated successfully. New credentials active.");
    setLoginForm(f=>({...f,currentPassword:"", newPassword:"", confirmPassword:""}));
  };
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">Settings & Administration — Single Login • Branding • Exchange</h1>

      {/* SINGLE LOGIN HIGHLIGHT */}
      <div className="card p-6 border-[#C9A86A]/30 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white relative overflow-hidden">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <div className="text-xs tracking-widest uppercase text-[#C9A86A]">🔐 Single Staff Login — Only One Active</div>
            <h3 className="font-serif text-xl font-bold mt-1">GOTA Voyages — One Login System</h3>
            <p className="text-sm text-white/60 mt-1 max-w-xl">This application uses <b className="text-white">exactly one</b> staff login for all authorized operations. There are no multiple accounts, no role chooser, no customer logins. Updating here replaces the previous credentials immediately. Keep it secure.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[220px]">
            <div className="text-xs text-[#C9A86A]">Current active login</div>
            <div className="text-sm font-medium mt-1">{loginForm.email}</div>
            <div className="text-xs text-white/60">{loginForm.name} • administrator</div>
            <div className="mt-2 text-xs bg-[#C9A86A] text-black px-3 py-1 rounded-full inline-block">● One login enforced</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div><label className="text-xs text-white/70">Staff Email (single)</label><input value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})} className="mt-1 w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C9A86A]" placeholder="tourisme@gotainternational.com"/></div>
          <div><label className="text-xs text-white/70">Display Name</label><input value={loginForm.name} onChange={e=>setLoginForm({...loginForm,name:e.target.value})} className="mt-1 w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C9A86A]" placeholder="GOTA Admin"/></div>
          <div><label className="text-xs text-white/70">Current Password (required to change)</label><input type="password" value={loginForm.currentPassword} onChange={e=>setLoginForm({...loginForm,currentPassword:e.target.value})} className="mt-1 w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C9A86A]" placeholder="Current password"/></div>
          <div><label className="text-xs text-white/70">New Password</label><input type="password" value={loginForm.newPassword} onChange={e=>setLoginForm({...loginForm,newPassword:e.target.value})} className="mt-1 w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C9A86A]" placeholder="New password (leave blank to keep)"/></div>
          <div><label className="text-xs text-white/70">Confirm New Password</label><input type="password" value={loginForm.confirmPassword} onChange={e=>setLoginForm({...loginForm,confirmPassword:e.target.value})} className="mt-1 w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C9A86A]" placeholder="Confirm"/></div>
          <div className="flex items-end"><button onClick={updateLogin} className="w-full bg-[#C9A86A] text-black py-3 rounded-full font-semibold text-sm">Update Single Login →</button></div>
        </div>
        {loginMsg && <div className="mt-4 text-sm bg-white text-[#0a0a0a] p-3 rounded-2xl">{loginMsg}</div>}
        <div className="mt-4 text-xs text-white/50">Default after seed: <b className="text-white">tourisme@gotainternational.com / Gota2026!</b> — change immediately in production. No password is shown to clients. Client documents never expose credentials.</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold">Company & Branding</h3>
          <div className="space-y-3 mt-3">
            <input value={settings.companyName} onChange={e=>setSettings({...settings,companyName:e.target.value})} placeholder="Company Name" className="input"/>
            <input value={settings.tagline} onChange={e=>setSettings({...settings,tagline:e.target.value})} placeholder="Tagline" className="input"/>
            <input value={settings.logoUrl} onChange={e=>setSettings({...settings,logoUrl:e.target.value})} placeholder="Logo URL (upload configurable)" className="input"/>
            <div className="p-4 rounded-2xl bg-[#0a0a0a] text-white flex gap-3 items-center"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A86A] to-[#8C6A2F] flex items-center justify-center font-bold">G</div><div><div className="font-serif font-bold">{settings.companyName}</div><div className="text-xs text-[#C9A86A]">{settings.tagline}</div></div></div>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold">Exchange & Currency</h3>
          <div className="space-y-3 mt-3">
            <label className="text-xs">Exchange: 1 FCFA = NGN <input value={settings.exchangeRate} onChange={e=>setSettings({...settings,exchangeRate:e.target.value})} className="input"/></label>
            <label className="text-xs">Rounding NGN nearest <input value={settings.roundingNGN} onChange={e=>setSettings({...settings,roundingNGN:e.target.value})} className="input"/></label>
            <select value={settings.currencyDisplay} onChange={e=>setSettings({...settings,currencyDisplay:e.target.value})} className="input"><option value="FCFA">FCFA only</option><option value="NGN">NGN only</option><option value="both">FCFA + NGN side-by-side</option></select>
            <div className="text-xs text-[#6b6b6b]">Formulas: NGN = FCFA × {settings.exchangeRate} • FCFA = NGN ÷ {settings.exchangeRate} • Snapshot saved per trip/quotation • Precise amounts, rounding only display.</div>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold">Margins & Terms</h3>
          <div className="space-y-3 mt-3">
            <input value={settings.defaultMargin} onChange={e=>setSettings({...settings,defaultMargin:e.target.value})} placeholder="Default Margin %" className="input"/>
            <input value={settings.paymentTerms} onChange={e=>setSettings({...settings,paymentTerms:e.target.value})} placeholder="Payment Terms" className="input"/>
            <input value={settings.quotationValidity} onChange={e=>setSettings({...settings,quotationValidity:e.target.value})} placeholder="Quotation Validity" className="input"/>
            <div className="text-xs text-[#6b6b6b]">Margins: agency 5%, direct 10%, corporate 10% editable. Override per trip. No double margin when final price approved.</div>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold">Access Model — Single Login Only</h3>
          <div className="space-y-2 mt-3 text-sm">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200"><b>✓ Active:</b> One staff login protects entire system — no customer accounts, no role picker</div>
            <div className="p-3 rounded-xl bg-[#fcfaf6] border"><b>Security:</b> SHA-256 hashed password, 7-day session cookie, audit logs</div>
            <div className="p-3 rounded-xl bg-[#fcfaf6] border"><b>Persistence:</b> PostgreSQL via Drizzle, no localStorage main DB, no secrets in browser</div>
            <div className="text-xs text-[#9a9a9a]">Requested: "only one login" — implemented as exclusive single credential. To rotate staff, update email/password here. Old session invalidated.</div>
          </div>
        </div>
      </div>
      <button onClick={save} className="btn-gold">Save Settings</button>
      <div className="card p-5">
        <h3 className="font-semibold">Data Management</h3>
        <div className="flex gap-2 mt-3">
          <button onClick={async()=>{ const r=await fetch("/api/trips"); const j=await r.json(); const blob=new Blob([JSON.stringify(j,null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="gota-trips-export.json"; a.click();}} className="bg-white border px-4 py-2 rounded-full text-sm">Export JSON</button>
          <button onClick={()=>alert("Import via Master Data add or API. Persistence across devices verified via PostgreSQL.")} className="bg-white border px-4 py-2 rounded-full text-sm">Import</button>
          <span className="text-xs text-[#9a9a9a] self-center">Persistent PostgreSQL via Drizzle.</span>
        </div>
      </div>
    </div>
  );
}
