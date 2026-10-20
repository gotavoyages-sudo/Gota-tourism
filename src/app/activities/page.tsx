"use client";
import { useEffect, useState } from "react";
export default function ActivitiesPage(){
  const [acts,setActs]=useState<any[]>([]);
  const [filter,setFilter]=useState("all");
  const load=async()=>{ const r=await fetch("/api/master?type=activities"); if(r.ok) setActs(await r.json());};
  useEffect(()=>{load();},[]);
  const filtered=acts.filter(a=> filter==="all" || a.country===filter);
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">Tours & Activities — Benin • Togo • Nigeria</h1>
      <div className="flex gap-2">
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="input w-40"><option value="all">All Countries</option><option>Benin</option><option>Togo</option><option>Nigeria</option></select>
        <span className="text-sm text-[#6b6b6b] self-center">Fixed group prices never multiply. Unknown pricing basis flagged. Adult/Child rates preserved.</span>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((a:any)=>(
          <div key={a.id} className="card p-4">
            <div className="flex justify-between"><span className="text-xs badge-gold">{a.country} • {a.currency}</span>{a.fixed_group_price? <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">FIXED GROUP</span>: <span className="text-xs text-[#9a9a9a]">{a.pricing_basis}</span>}</div>
            <div className="font-medium text-sm mt-2">{a.name}</div>
            <div className="text-xs text-[#6b6b6b]">{a.classification} {a.per_person? '• per-person':'• per-trip/group'}</div>
            <div className="text-sm mt-1">Cost: {a.supplier_cost? Number(a.supplier_cost).toLocaleString()+' '+a.currency:'—? missing'} • Sell: {a.selling_price? Number(a.selling_price).toLocaleString()+' '+a.currency:'—'}</div>
            <div className="text-xs mt-1 text-[#6b6b6b]">{a.notes?.slice(0,150)}</div>
            { (a.supplier_cost==null || a.notes?.includes('unconfirmed')) && <div className="mt-2 text-xs bg-amber-50 text-amber-700 p-2 rounded-xl">⚠️ Missing/ unconfirmed — profit flagged incomplete</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
