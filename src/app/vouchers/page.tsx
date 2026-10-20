"use client";
import { useEffect, useState } from "react";
export default function VouchersPage(){
  const [trips,setTrips]=useState<any[]>([]);
  const [selected,setSelected]=useState<any>(null);
  useEffect(()=>{ fetch("/api/trips").then(r=>r.json()).then(setTrips);},[]);
  const open=async(id:number)=>{
    const r=await fetch(`/api/trips/${id}`); const j=await r.json(); setSelected(j);
  };
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">Hotel Vouchers & Booking Status</h1>
      <p className="text-sm text-[#6b6b6b]">One voucher per hotel in multi-hotel trip. Hotel, guest, room, occupancy, dates, nights, BF entitlement, meal, requests, contact, status. Never show internal rates/margins on client voucher. Statuses: Pending → Requested → Confirmed → Cancelled (staff only).</p>
      <div className="flex gap-2 overflow-x-auto">
        {trips.map((t:any)=><button key={t.id} onClick={()=>open(t.id)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${selected?.trip?.id===t.id? 'bg-[#0a0a0a] text-white':'bg-white border'}`}>{t.title} #{t.id}</button>)}
      </div>
      {selected && (
        <div className="space-y-4">
          {selected.accommodations.map((a:any)=>(
            <div key={a.id} className="card p-6 print:border-2">
              <div className="flex justify-between">
                <div><div className="text-xs tracking-widest text-[#C9A86A] uppercase">GOTA Voyages • Hotel Voucher</div><h3 className="font-serif text-xl font-bold mt-1">{a.hotel_name} • {a.location}</h3><p className="text-sm text-[#6b6b6b]">Guest: {selected.trip.client_name} • {a.guests} guests • {a.room_category} • {a.occupancy_type} • {a.rooms} room(s)</p></div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold self-start ${a.booking_status==='Confirmed'?'bg-emerald-100 text-emerald-700': a.booking_status==='Pending'?'bg-amber-100 text-amber-700':'bg-gray-100'}`}>{a.booking_status}</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
                <div className="p-3 rounded-xl bg-[#fcfaf6] border"><div className="text-xs text-[#9a9a9a]">Check-in</div><div className="font-medium">{a.check_in||'TBD'}</div></div>
                <div className="p-3 rounded-xl bg-[#fcfaf6] border"><div className="text-xs text-[#9a9a9a]">Check-out</div><div className="font-medium">{a.check_out||'TBD'}</div></div>
                <div className="p-3 rounded-xl bg-[#fcfaf6] border"><div className="text-xs text-[#9a9a9a]">Nights</div><div className="font-medium">{a.nights} (calc from dates)</div></div>
                <div className="p-3 rounded-xl bg-[#fcfaf6] border"><div className="text-xs text-[#9a9a9a]">Breakfast Entitlement</div><div className="font-medium">{a.breakfast_included_qty} per room per service → {Number(a.breakfast_included_qty)*Number(a.nights)*Number(a.rooms)} total included, extra {a.extra_breakfast_qty}</div></div>
                <div className="p-3 rounded-xl bg-[#fcfaf6] border"><div className="text-xs text-[#9a9a9a]">Meal Plan</div><div className="font-medium">{a.meal_plan}</div></div>
                <div className="p-3 rounded-xl bg-[#fcfaf6] border"><div className="text-xs text-[#9a9a9a]">Reference</div><div className="font-medium">{a.reference||'— Not confirmed yet —'}</div></div>
              </div>
              <p className="text-xs text-[#6b6b6b] mt-3">Special requests: {a.special_requests||'—'} • Contact: on file • This voucher never shows supplier rates, commissions, margins or profit.</p>
              <button onClick={()=>window.print()} className="mt-4 btn-black text-sm">Print Voucher</button>
            </div>
          ))}
          {selected.accommodations.length===0 && <div className="text-sm text-[#9a9a9a] py-8 text-center">No accommodations for this trip. Add in Trip → Accommodations.</div>}
        </div>
      )}
    </div>
  );
}
