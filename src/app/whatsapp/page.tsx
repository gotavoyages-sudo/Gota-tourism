"use client";
import { useEffect, useState } from "react";
export default function WhatsAppPage(){
  const [trips,setTrips]=useState<any[]>([]);
  const [tripId,setTripId]=useState("");
  const [msg,setMsg]=useState("");
  const [phone,setPhone]=useState("");
  useEffect(()=>{ fetch("/api/trips").then(r=>r.json()).then(setTrips);},[]);
  const gen=async(type:string)=>{
    if(!tripId) return;
    const r=await fetch(`/api/trips/${tripId}`); const d=await r.json(); const t=d.trip;
    if(type==='itinerary'){
      const text=`Hello ${t.client_name} 👋\n\nGOTA Voyages | Expert Through Experience presents your itinerary:\n\n*${t.title}*\n📍 ${t.departure_city} → ${t.destination_city}\n📅 ${t.start_date} to ${t.end_date} • ${t.nights} nights / ${t.duration_days} days\n👥 ${t.adults} persons\n\nYour premium day-by-day plan is ready. Shall I send the PDF itinerary?\n\n_— GOTA Voyages_`;
      setMsg(text); setPhone(t.client_phone||"");
    } else if(type==='quotation'){
      const q=d.quotations[0];
      const text=`Hello ${t.client_name} 👋\n\nGOTA Voyages quotation ready:\n\n*${q? q.title : t.title}*\n💰 Total: ${q? Number(q.final_amount).toLocaleString()+' '+q.currency : 'on request'}\n📅 Valid until: ${q? q.valid_until : '7 days'}\n\nReply to confirm or request adjustments.\n\nPayment terms: 50% deposit to confirm.\n\n_— GOTA Voyages | Expert Through Experience_`;
      setMsg(text); setPhone(t.client_phone||"");
    } else if(type==='payment'){
      const text=`Hello ${t.client_name} 👋\n\nPayment reminder from GOTA Voyages:\n\n*${t.title}*\nAmount due: Please confirm balance.\nPay via bank transfer / mobile money.\nReference: GOTA-${t.id}\n\nThank you!\n_— GOTA Voyages_`;
      setMsg(text); setPhone(t.client_phone||"");
    }
  };
  const encoded=encodeURIComponent(msg);
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">WhatsApp Generator — Editable, Encoded, Not Auto-Sent</h1>
      <div className="card p-5 flex gap-3">
        <select value={tripId} onChange={e=>setTripId(e.target.value)} className="input max-w-md"><option value="">Select Trip</option>{trips.map((t:any)=><option key={t.id} value={t.id}>{t.title} #{t.id} • {t.client_name}</option>)}</select>
        <button onClick={()=>gen('itinerary')} className="bg-white border px-4 py-2 rounded-full text-sm">Itinerary Msg</button>
        <button onClick={()=>gen('quotation')} className="bg-white border px-4 py-2 rounded-full text-sm">Quotation Msg</button>
        <button onClick={()=>gen('payment')} className="bg-white border px-4 py-2 rounded-full text-sm">Payment Msg</button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-semibold">Editable Message</h3>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} className="input h-64 mt-3" placeholder="Generated WhatsApp message appears here..."/>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Recipient phone with country code e.g. +229015..." className="input mt-3"/>
          <div className="mt-3 flex gap-2">
            <button onClick={()=>navigator.clipboard.writeText(msg)} className="btn-black text-sm">Copy Message</button>
            <a href={`https://wa.me/${phone.replace(/[^0-9]/g,'')}?text=${encoded}`} target="_blank" className="btn-gold text-sm">Open WhatsApp</a>
          </div>
          <p className="text-xs text-[#9a9a9a] mt-2">Opening WhatsApp does not mean sent. Message correctly encoded.</p>
        </div>
        <div className="card p-5 bg-[#0a0a0a] text-white">
          <h3 className="font-semibold text-[#C9A86A]">Preview</h3>
          <pre className="whitespace-pre-wrap text-sm mt-3 bg-white/10 p-4 rounded-2xl">{msg || 'Select trip and generate type.'}</pre>
        </div>
      </div>
    </div>
  );
}
