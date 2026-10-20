"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TripsPage(){
  const [trips,setTrips]=useState<any[]>([]);
  const [q,setQ]=useState("");
  const [loading,setLoading]=useState(true);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:"", clientName:"", clientEmail:"", clientPhone:"", departureCity:"Lagos", destinationCity:"Cotonou", startDate:"", endDate:"", nights:2, durationDays:3, adults:7, children:0, infants:0, singleOccupancy:0, doubleOccupancy:4, targetProfit:550000, status:"draft"});
  const load=async()=>{
    const r=await fetch("/api/trips"); if(r.ok) setTrips(await r.json()); setLoading(false);
  };
  useEffect(()=>{load();},[]);
  const create=async()=>{
    const res=await fetch("/api/trips",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...form, departureCountry:"Nigeria", destinationCountry:"Benin", expectedRevenue:0})});
    if(res.ok){ setShow(false); load(); }
  };
  const duplicate=async(t:any)=>{
    const payload={...t, title:t.title+" (Copy)", clientName:t.client_name, clientEmail:t.client_email, clientPhone:t.client_phone, departureCity:t.departure_city, destinationCity:t.destination_city, startDate:t.start_date, endDate:t.end_date, nights:t.nights, durationDays:t.duration_days, adults:t.adults, children:t.children, infants:t.infants, singleOccupancy:t.single_occupancy, doubleOccupancy:t.double_occupancy, targetProfit:t.target_profit, status:"draft"};
    await fetch("/api/trips",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)}); load();
  };
  const filtered=trips.filter(t=> !q || t.title.toLowerCase().includes(q.toLowerCase()) || t.client_name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="font-serif text-2xl font-bold">Trips & Clients</h1><p className="text-sm text-[#6b6b6b]">One Trip = One Client Profile + One Itinerary + Quotations + Bookings + Financials</p></div>
        <button onClick={()=>setShow(true)} className="btn-gold text-sm">+ New Trip</button>
      </div>
      <div className="flex gap-3">
        <input placeholder="Search trip or client..." value={q} onChange={e=>setQ(e.target.value)} className="input max-w-md"/>
        <Link href="/trips" className="bg-white border px-4 py-2 rounded-xl text-sm">Filters</Link>
        <span className="text-sm text-[#6b6b6b] self-center">{filtered.length} trips</span>
      </div>
      {loading? <div className="py-12 text-center text-sm text-[#9a9a9a]">Loading...</div> :
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(t=>(
          <div key={t.id} className="card p-5 hover:shadow-lg transition">
            <div className="flex justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${t.status==='draft' ? 'bg-amber-100 text-amber-700' : t.status==='confirmed'? 'bg-emerald-100 text-emerald-700':'bg-gray-100'}`}>{t.status}</span>
              <span className="text-xs text-[#9a9a9a]">ID #{t.id}</span>
            </div>
            <h3 className="font-semibold mt-3">{t.title}</h3>
            <p className="text-sm text-[#6b6b6b]">{t.client_name} • {t.client_email}</p>
            <p className="text-xs text-[#9a9a9a] mt-1">{t.departure_city} → {t.destination_city} • {t.start_date||'TBD'} - {t.end_date||'TBD'} • {t.nights} nights • {t.adults} adults {Number(t.children)>0? `+${t.children} children`:''}</p>
            <p className="text-xs mt-2">Pax: {t.adults} • Single: {t.single_occupancy} • Double: {t.double_occupancy} • Target profit: ₦{Number(t.target_profit).toLocaleString()}</p>
            <div className="mt-4 flex gap-2">
              <Link href={`/trips/${t.id}`} className="flex-1 bg-[#0a0a0a] text-white text-center py-2 rounded-full text-sm">Open</Link>
              <button onClick={()=>duplicate(t)} className="border px-4 py-2 rounded-full text-sm bg-white">Duplicate</button>
            </div>
            <div className="mt-2 text-[11px] text-[#9a9a9a]">Created {new Date(t.created_at).toLocaleDateString()} • Language: {t.language}</div>
          </div>
        ))}
      </div>}
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={()=>setShow(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={e=>e.stopPropagation()}>
            <h3 className="font-semibold text-lg">Create New Trip</h3>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              <input placeholder="Trip Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="input"/>
              <input placeholder="Client / Group Name" value={form.clientName} onChange={e=>setForm({...form,clientName:e.target.value})} className="input"/>
              <input placeholder="Client Email" value={form.clientEmail} onChange={e=>setForm({...form,clientEmail:e.target.value})} className="input"/>
              <input placeholder="Client Phone" value={form.clientPhone} onChange={e=>setForm({...form,clientPhone:e.target.value})} className="input"/>
              <input placeholder="Departure City" value={form.departureCity} onChange={e=>setForm({...form,departureCity:e.target.value})} className="input"/>
              <input placeholder="Destination City" value={form.destinationCity} onChange={e=>setForm({...form,destinationCity:e.target.value})} className="input"/>
              <label className="text-xs">Start Date <input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} className="input"/></label>
              <label className="text-xs">End Date <input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} className="input"/></label>
              <input type="number" placeholder="Nights" value={form.nights} onChange={e=>setForm({...form,nights:Number(e.target.value)})} className="input"/>
              <input type="number" placeholder="Duration Days" value={form.durationDays} onChange={e=>setForm({...form,durationDays:Number(e.target.value)})} className="input"/>
              <input type="number" placeholder="Adults" value={form.adults} onChange={e=>setForm({...form,adults:Number(e.target.value)})} className="input"/>
              <input type="number" placeholder="Children" value={form.children} onChange={e=>setForm({...form,children:Number(e.target.value)})} className="input"/>
              <input type="number" placeholder="Infants" value={form.infants} onChange={e=>setForm({...form,infants:Number(e.target.value)})} className="input"/>
              <input type="number" placeholder="Target Profit NGN" value={form.targetProfit} onChange={e=>setForm({...form,targetProfit:Number(e.target.value)})} className="input"/>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setShow(false)} className="px-5 py-2 rounded-full border bg-white">Cancel</button>
              <button onClick={create} className="btn-gold">Create Trip</button>
            </div>
            <p className="text-xs text-[#9a9a9a] mt-3">Creates itinerary days + starter services (Ganvié, Ouidah, transport) automatically. Financials update live.</p>
          </div>
        </div>
      )}
    </div>
  );
}
