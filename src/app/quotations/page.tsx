"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function QuotationsPage(){
  const [quotes,setQuotes]=useState<any[]>([]);
  const [trips,setTrips]=useState<any[]>([]);
  const load=async()=>{ const r=await fetch("/api/quotations"); if(r.ok) setQuotes(await r.json()); const t=await fetch("/api/trips"); if(t.ok) setTrips(await t.json());};
  useEffect(()=>{load();},[]);
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">Quotations — Itemized • Package • No-price • Multi-option</h1>
      <p className="text-sm text-[#6b6b6b]">Each option calculated independently. Never add fixed single supplement without actual room diff. Acceptance does not confirm bookings/payments. Versioned snapshots preserved. EN/FR switch per document.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {quotes.map((q:any)=>(
          <div key={q.id} className="card p-5">
            <div className="flex justify-between"><span className="text-xs bg-[#0a0a0a] text-white px-3 py-1 rounded-full">v{q.version} • {q.status} • {q.language}</span><span className="text-xs text-[#9a9a9a]">{q.valid_until? 'Valid until '+q.valid_until:''}</span></div>
            <div className="font-medium mt-2">{q.title}</div>
            <div className="text-xs text-[#6b6b6b]">{q.trip_title} • {q.client_name}</div>
            <div className="text-sm mt-2">Total: {Number(q.total_selling_price).toLocaleString()} - Disc {Number(q.discount).toLocaleString()} + Add {Number(q.additional_charges).toLocaleString()} = <b>{Number(q.final_amount).toLocaleString()} {q.currency}</b></div>
            <div className="text-xs mt-1">Inc: {q.inclusions?.slice(0,100)}</div>
            <div className="mt-3 flex gap-2"><Link href={`/trips/${q.trip_id}`} className="text-xs bg-white border px-3 py-1 rounded-full">Open Trip</Link><Link href={`/documents?trip=${q.trip_id}&quote=${q.id}`} className="text-xs bg-[#C9A86A] text-black px-3 py-1 rounded-full">Preview / PDF</Link></div>
          </div>
        ))}
        {quotes.length===0 && <div className="text-sm text-[#9a9a9a] py-8">No quotations yet. Create from Trip detail.</div>}
      </div>
    </div>
  );
}
