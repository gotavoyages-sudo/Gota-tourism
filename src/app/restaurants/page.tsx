"use client";
import { useEffect, useState } from "react";
export default function RestaurantsPage(){
  const [data,setData]=useState<any[]>([]);
  const [q,setQ]=useState("");
  const load=async()=>{ const r=await fetch("/api/master?type=restaurants"); if(r.ok) setData(await r.json());};
  useEffect(()=>{load();},[]);
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">Restaurants & Meals — Searchable Database</h1>
      <div className="flex gap-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search restaurant or destination..." className="input max-w-md"/><span className="text-sm text-[#6b6b6b] self-center">Meal plans: room-only, B&B, half board, full board, all-inclusive, custom</span></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.filter((r:any)=>!q || r.name.toLowerCase().includes(q.toLowerCase())).map((r:any)=>(
          <div key={r.id} className="card p-4">
            <div className="font-medium text-sm">{r.name} <span className="text-xs text-[#9a9a9a]">• {r.destination}</span></div>
            <div className="text-xs text-[#6b6b6b]">{r.cuisine} • {r.meal_type} • {r.included_type} • {r.classification}</div>
            <div className="text-sm mt-1">Cost: {r.cost_per_person? Number(r.cost_per_person).toLocaleString()+' '+r.currency : '—'}</div>
            <div className="text-xs text-[#6b6b6b] mt-1">{r.notes?.slice(0,100)}</div>
            <div className="mt-2 text-[11px] bg-[#fcfaf6] border p-2 rounded-xl">Types: 1 Included by GOTA • 2 All-inclusive • 3 Guest-paid • 4 Optional extra • 5 Reservation status</div>
          </div>
        ))}
      </div>
    </div>
  );
}
