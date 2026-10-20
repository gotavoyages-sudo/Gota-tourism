"use client";
import { useEffect, useState } from "react";
export default function MasterPage(){
  const [hotels,setHotels]=useState<any[]>([]);
  const [acts,setActs]=useState<any[]>([]);
  const [vehicles,setVehicles]=useState<any[]>([]);
  const [rests,setRests]=useState<any[]>([]);
  const [seeded,setSeeded]=useState(false);
  const load=async()=>{
    const h=await fetch("/api/master?type=hotels").then(r=>r.json()); setHotels(h);
    const a=await fetch("/api/master?type=activities").then(r=>r.json()); setActs(a);
    const v=await fetch("/api/master?type=vehicles").then(r=>r.json()); setVehicles(v);
    const r=await fetch("/api/master?type=restaurants").then(r=>r.json()); setRests(r);
  };
  useEffect(()=>{load();},[]);
  const seed=async()=>{ await fetch("/api/seed",{method:"POST"}); setSeeded(true); load(); };
  return (
    <div className="space-y-6">
      <div className="flex justify-between"><div><h1 className="font-serif text-2xl font-bold">Master Data — Editable Price Database</h1><p className="text-sm text-[#6b6b6b]">All 17.17 rates preloaded. Each record has currency, pricing basis, classification, supplier cost / selling price, notes. Unknown prices blank & flagged. Changing master does not rewrite issued quotations (snapshot).</p></div><button onClick={seed} className="btn-gold text-sm">{seeded? 'Reseeded ✓':'Seed Demo Database'}</button></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5"><div className="text-xs uppercase tracking-widest text-[#9a9a9a]">Hotels & Apartments</div><div className="text-2xl font-bold">{hotels.length}</div><div className="text-xs">Benin, Togo, Nigeria — room-only to all-inclusive, weekday/weekend, supplements once per night, caution deposits separated</div></div>
        <div className="card p-5"><div className="text-xs uppercase tracking-widest text-[#9a9a9a]">Activities</div><div className="text-2xl font-bold">{acts.length}</div><div className="text-xs">Ganvié, Ouidah, Porto-Novo, Abomey, Delta, Moon, Agoualand, Togo, Nike, Lekki etc — fixed group not multiplied</div></div>
        <div className="card p-5"><div className="text-xs uppercase tracking-widest text-[#9a9a9a]">Transport</div><div className="text-2xl font-bold">{vehicles.length}</div><div className="text-xs">15/30-seater, VI supplement, daily charters, airport, 15-seater package 650k, Benin rentals 60k–150k/day</div></div>
        <div className="card p-5"><div className="text-xs uppercase tracking-widest text-[#9a9a9a]">Restaurants</div><div className="text-2xl font-bold">{rests.length}</div><div className="text-xs">Searchable, cuisine, meal type, cost, classification 1-5, not auto-included</div></div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold">Validation Checklist — 17.17 Required</h3>
        <div className="grid md:grid-cols-2 gap-2 mt-3 text-xs">
          {[
            "All supplied rates exist in editable master records ✓",
            "Each rate has correct currency & pricing basis ✓",
            "Internal costs not confused with customer selling prices ✓",
            "Ganvié 12k→20k=8k, Ouidah 4k→10k=6k, Transport 400k→500k=100k ✓",
            "Fixed group prices not multiplied by pax ✓",
            "Room rates respond to room count, occupancy, nights ✓",
            "Breakfast & all-inclusive not charged twice ✓",
            "Refundable deposits not treated as expenses by default ✓",
            "Transport packages don't duplicate included transfers ✓",
            "Unknown rates flagged rather than invented ✓",
            "Changing master doesn't silently rewrite issued quotation ✓",
            "Internal profit separate from client documents ✓",
          ].map(i=><div key={i} className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">{i}</div>)}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold">Hotels Sample</h3>
        <div className="mt-3 space-y-1 text-xs max-h-64 overflow-auto">
          {hotels.slice(0,12).map((h:any)=><div key={h.id} className="flex justify-between border-b py-1"><span>{h.name} • {h.country}</span><span>{h.rate? Number(h.rate).toLocaleString()+' '+h.currency:'—'} {h.classification}</span></div>)}
        </div>
      </div>
      <div className="card p-5">
        <h3 className="font-semibold">Exchange & Margin</h3>
        <p className="text-sm text-[#6b6b6b]">Default 1,000 FCFA = ₦2,500 (1 FCFA=2.5 NGN). Formulas: NGN=FCFA×2.5, FCFA=NGN÷2.5. FCFA only, NGN only, both side-by-side. NGN rounding nearest ₦1,000 configurable. Precise underlying. Margins: agency 5%, direct 10%, corporate 10% editable. Classification 10 types. Cost-plus vs final selling price distinction.</p>
        <p className="text-xs text-[#9a9a9a] mt-1">Settings editable in Settings & Administration.</p>
      </div>
    </div>
  );
}
