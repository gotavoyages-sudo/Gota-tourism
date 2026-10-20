"use client";
import { useEffect, useState } from "react";
export default function PaymentsPage(){
  const [payments,setPayments]=useState<any[]>([]);
  const load=async()=>{ const r=await fetch("/api/payments"); if(r.ok) setPayments(await r.json());};
  useEffect(()=>{load();},[]);
  const totalClient = payments.filter(p=>p.payer_type==='client' && p.status==='confirmed').reduce((s:any,p:any)=>s+Number(p.amount),0);
  const totalSupplier = payments.filter(p=>p.payer_type==='supplier').reduce((s:any,p:any)=>s+Number(p.amount),0);
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">Payments — Client & Supplier • Refundable Deposits Separated</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5"><div className="text-xs text-[#9a9a9a] uppercase tracking-widest">Client Received</div><div className="text-2xl font-bold">₦{totalClient.toLocaleString()}</div><div className="text-xs text-[#9a9a9a]">Confirmed only counts to outstanding</div></div>
        <div className="card p-5"><div className="text-xs text-[#9a9a9a] uppercase tracking-widest">Supplier Paid</div><div className="text-2xl font-bold">₦{totalSupplier.toLocaleString()}</div><div className="text-xs text-[#9a9a9a]">Separate from client balance</div></div>
        <div className="card p-5 bg-amber-50"><div className="text-xs text-amber-700 uppercase tracking-widest">Refundable Deposits</div><div className="text-sm mt-1">Caution deposits recorded as liability, not expense unless forfeited. Shown separately.</div></div>
      </div>
      <div className="space-y-2">
        {payments.map((p:any)=><div key={p.id} className="card p-4 flex justify-between text-sm"><span>{p.trip_title||'Trip #'+p.trip_id} • {p.type} • {p.payer_type} • {p.amount} {p.currency} • {p.method} • {p.date} • {p.status} • {p.reference}</span><span className={`px-2 py-1 rounded-full text-xs ${p.status==='confirmed'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{p.status}</span></div>)}
        {payments.length===0 && <div className="text-sm text-[#9a9a9a] py-8 text-center">No payments yet. Record in Trip → Payments.</div>}
      </div>
    </div>
  );
}
