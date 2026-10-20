"use client";
import { useEffect, useState } from "react";
export default function TransportPage(){
  const [vehicles,setVehicles]=useState<any[]>([]);
  const load=async()=>{ const r=await fetch("/api/master?type=vehicles"); if(r.ok) setVehicles(await r.json());};
  useEffect(()=>{load();},[]);
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">Transportation — Vehicles • Packages • Benin Rentals</h1>
      <div className="text-sm text-[#6b6b6b]">15-seater cost ₦400k → sell ₦500k = ₦100k diff per one-way. Combined package ₦650k includes pickup+2 nights local — do not duplicate. Same Vehicle toggle covers all transfers when permitted. Distinguish supplier cost vs selling price.</div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {vehicles.map((v:any)=>(
          <div key={v.id} className="card p-4">
            <div className="flex justify-between"><span className="text-xs badge-gold">{v.currency} • {v.pricing_basis}</span><span className="text-xs bg-black text-white px-2 py-1 rounded-full">{v.capacity||'-'} seater</span></div>
            <div className="font-medium text-sm mt-2">{v.name}</div>
            <div className="text-xs text-[#6b6b6b]">{v.classification} • Rate: {v.rate? Number(v.rate).toLocaleString()+' '+v.currency: '—'} {v.supplier_cost? `Cost ${Number(v.supplier_cost).toLocaleString()}`:''} {v.selling_price? `Sell ${Number(v.selling_price).toLocaleString()}`:''}</div>
            <div className="text-xs text-[#6b6b6b] mt-1">{v.inclusions?.slice(0,120)}</div>
            <div className="text-xs mt-1">{v.notes?.slice(0,100)}</div>
            {v.inclusions?.includes('DO NOT') && <div className="mt-2 text-xs bg-red-50 text-red-700 p-2 rounded-xl">⚠️ Prevent overlapping charges</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
