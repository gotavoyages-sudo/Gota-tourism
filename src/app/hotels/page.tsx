"use client";
import { useEffect, useState } from "react";
export default function HotelsPage(){
  const [hotels,setHotels]=useState<any[]>([]);
  const [q,setQ]=useState("");
  const [country,setCountry]=useState("all");
  const [form,setForm]=useState({name:"", country:"Benin", city:"Cotonou", category:"", rate:"", currency:"FCFA", pricingBasis:"per-room-per-night", classification:"starting_customer_rate", supplierCost:"", sellingRate:"", breakfastPrice:"", notes:""});
  const load=async()=>{ const r=await fetch("/api/master?type=hotels"); if(r.ok) setHotels(await r.json());};
  useEffect(()=>{load();},[]);
  const add=async()=>{ await fetch("/api/master",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...form, table:"hotels_master", rate: form.rate?Number(form.rate):null, supplierCost: form.supplierCost?Number(form.supplierCost):null, sellingRate: form.sellingRate?Number(form.sellingRate):null, breakfastPrice: form.breakfastPrice?Number(form.breakfastPrice):null})}); load();};
  const filtered=hotels.filter(h=> (!q || h.name.toLowerCase().includes(q.toLowerCase())) && (country==="all" || h.country===country));
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">Hotels & Apartments — Master Database</h1>
      <div className="flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search hotel..." className="input max-w-sm"/>
        <select value={country} onChange={e=>setCountry(e.target.value)} className="input w-40"><option value="all">All Countries</option><option>Benin</option><option>Togo</option><option>Nigeria</option></select>
        <span className="text-sm text-[#6b6b6b] self-center">{filtered.length} records • All rates editable, confirm pricing basis</span>
      </div>
      <div className="card p-5">
        <h3 className="font-semibold text-sm">Add New Hotel / Room Category</h3>
        <div className="grid md:grid-cols-4 gap-2 mt-3">
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="input"/>
          <input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="City" className="input"/>
          <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Room Category" className="input"/>
          <input value={form.rate} onChange={e=>setForm({...form,rate:e.target.value})} placeholder="Rate" className="input"/>
          <select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})} className="input"><option>FCFA</option><option>NGN</option></select>
          <select value={form.pricingBasis} onChange={e=>setForm({...form,pricingBasis:e.target.value})} className="input"><option>per-room-per-night</option><option>per-person</option><option>per-trip</option></select>
          <input value={form.supplierCost} onChange={e=>setForm({...form,supplierCost:e.target.value})} placeholder="Supplier Cost" className="input"/>
          <input value={form.sellingRate} onChange={e=>setForm({...form,sellingRate:e.target.value})} placeholder="Selling Rate" className="input"/>
          <input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Notes" className="input md:col-span-2"/>
        </div>
        <button onClick={add} className="mt-3 btn-gold text-sm">Add to Master</button>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((h:any)=>(
          <div key={h.id} className="card p-4">
            <div className="flex justify-between"><span className="text-xs badge-gold">{h.country} • {h.currency}</span><span className="text-xs text-[#9a9a9a]">{h.pricing_basis}</span></div>
            <div className="font-medium text-sm mt-2">{h.name}</div>
            <div className="text-xs text-[#6b6b6b]">{h.city} • {h.category} • Classification: {h.classification}</div>
            <div className="text-sm mt-1">Rate: <b>{h.rate? Number(h.rate).toLocaleString(): '—'} {h.currency}</b> {h.supplier_cost? `Cost ${Number(h.supplier_cost).toLocaleString()}`:''} {h.selling_rate? `Sell ${Number(h.selling_rate).toLocaleString()}`:''}</div>
            <div className="text-xs text-[#6b6b6b] mt-1">Breakfast: {h.breakfast_price||'—'} • {h.notes?.slice(0,80)}</div>
            {h.notes?.includes('Do not invent') || h.notes?.includes('To be confirmed') && <div className="mt-2 text-xs bg-amber-50 text-amber-700 p-2 rounded-xl">⚠️ Confirm before margin application</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
