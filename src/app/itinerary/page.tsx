"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function ItineraryIndex(){
  const [trips,setTrips]=useState<any[]>([]);
  const [id,setId]=useState("");
  const [data,setData]=useState<any>(null);
  useEffect(()=>{ fetch("/api/trips").then(r=>r.json()).then(j=>{setTrips(j); if(j[0]) setId(String(j[0].id));});},[]);
  useEffect(()=>{ if(id) fetch(`/api/trips/${id}`).then(r=>r.json()).then(setData);},[id]);
  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="font-serif text-2xl font-bold">Itinerary Builder — Premium Proposal</h1><select value={id} onChange={e=>setId(e.target.value)} className="input w-64">{trips.map((t:any)=><option key={t.id} value={t.id}>{t.title} #{t.id}</option>)}</select></div>
      {!data? <div className="py-12 text-center text-sm">Select a trip to view itinerary.</div> :
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex justify-between"><div><div className="text-xs tracking-widest text-[#C9A86A] uppercase">GOTA Voyages • Expert Through Experience</div><h2 className="font-serif text-xl font-bold mt-1">{data.trip.title} — Itinerary</h2><p className="text-sm text-[#6b6b6b]">{data.trip.client_name} • {data.trip.departure_city} → {data.trip.destination_city} • {data.trip.start_date} to {data.trip.end_date} • {data.trip.adults} persons • {data.trip.nights} nights / {data.trip.duration_days} days</p></div><Link href={`/trips/${id}`} className="bg-[#0a0a0a] text-white px-4 py-2 rounded-full text-sm self-start">Edit in Trip</Link></div>
          </div>
          {data.days.map((d:any)=>(
            <div key={d.id} className="card p-6">
              <div className="bg-[#0a0a0a] text-white px-4 py-2 rounded-xl flex justify-between"><span className="font-bold">Day {d.day_number}: {d.title}</span><span className="text-xs text-[#C9A86A]">{d.date||'Date TBD'}</span></div>
              <p className="text-sm mt-3 text-[#333]">{d.description}</p>
              <div className="mt-3 space-y-2">
                {data.items.filter((it:any)=>it.day_id===d.id).map((it:any)=>(
                  <div key={it.id} className="flex gap-3 p-3 rounded-xl bg-[#fcfaf6] border text-sm"><span className="font-bold text-[#C9A86A] w-16">{it.time}</span><span><b>{it.title}</b> — {it.location} {it.duration? `• ${it.duration}`:''} {it.transport? `• ${it.transport}`:''}<div className="text-xs text-[#6b6b6b]">{it.notes}</div></span></div>
                ))}
              </div>
              <div className="mt-2 text-xs text-[#9a9a9a]">Overnight: See accommodation • Meals: {d.meals_included||'As per meal plan'} • Free time & optional activities flagged for staff review.</div>
            </div>
          ))}
          <div className="card p-6">
            <h3 className="font-semibold">Professional Notes</h3><p className="text-sm text-[#6b6b6b] mt-1">Inter-city transfers include realistic editable estimates. Border protocol where applicable. Do not assume fixed durations or invent opening hours. Flag conflicts. Restaurant meal arrangement clearly identified (5 types). Breakfast entitlement calculated from room entitlements.</p>
            <button onClick={()=>window.print()} className="mt-3 btn-black text-sm">Print Itinerary</button>
          </div>
        </div>
      }
    </div>
  );
}
