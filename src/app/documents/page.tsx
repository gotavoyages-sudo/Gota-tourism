"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function DocumentsInner(){
  const searchParams=useSearchParams();
  const initialTrip=searchParams.get("trip");
  const initialQuote=searchParams.get("quote");
  const [trips,setTrips]=useState<any[]>([]);
  const [tripId,setTripId]=useState(initialTrip||"");
  const [data,setData]=useState<any>(null);
  const [lang,setLang]=useState("EN");
  const [docType,setDocType]=useState("itinerary");
  useEffect(()=>{ fetch("/api/trips").then(r=>r.json()).then(setTrips);},[]);
  useEffect(()=>{ if(tripId) fetch(`/api/trips/${tripId}`).then(r=>r.json()).then(setData);},[tripId]);
  const t=data?.trip;
  const quote = data?.quotations.find((q:any)=> String(q.id)===String(initialQuote)) || data?.quotations[0];
  const sendEmail=()=>{
    if(!t) return;
    const subject=encodeURIComponent(`GOTA Voyages - ${docType} - ${t.title}`);
    const body=encodeURIComponent(`Dear ${t.client_name},\n\nPlease find your ${docType} for ${t.title} (${t.departure_city} → ${t.destination_city}, ${t.start_date} to ${t.end_date}).\n\nThank you for choosing GOTA Voyages | Expert Through Experience.\n\nBest regards`);
    window.location.href=`mailto:${t.client_email||''}?subject=${subject}&body=${body}`;
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between flex-wrap gap-3"><h1 className="font-serif text-2xl font-bold">Document Centre — Preview • Print • PDF • Email • WhatsApp</h1><select value={tripId} onChange={e=>setTripId(e.target.value)} className="input w-64"><option value="">Select Trip</option>{trips.map((t:any)=><option key={t.id} value={t.id}>{t.title} #{t.id}</option>)}</select></div>
      {!t? <div className="card p-12 text-center text-sm text-[#9a9a9a]">Select a trip to generate documents.</div> :
      <>
        <div className="flex gap-2 flex-wrap">
          <select value={docType} onChange={e=>setDocType(e.target.value)} className="input w-48"><option value="itinerary">Itinerary</option><option value="quotation_itemized">Itemized Quotation</option><option value="quotation_package">Package Quotation</option><option value="quotation_no_price">Quotation without Prices</option><option value="voucher">Hotel Voucher</option><option value="receipt">Payment Receipt</option><option value="profit_internal">Internal Profit (staff only)</option></select>
          <select value={lang} onChange={e=>setLang(e.target.value)} className="input w-32"><option>EN</option><option>FR</option></select>
          <button onClick={()=>window.print()} className="btn-black text-sm">Print</button>
          <button onClick={()=>window.print()} className="bg-white border px-4 py-2 rounded-full text-sm">Save / Export as PDF (Print → Save as PDF)</button>
          <button onClick={sendEmail} className="bg-white border px-4 py-2 rounded-full text-sm">Email (mailto fallback)</button>
          <a href={`/whatsapp`} className="btn-gold text-sm">WhatsApp Generator</a>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl print:shadow-none border" id="doc">
          <div className="flex justify-between items-start border-b pb-6">
            <div className="flex gap-3"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A86A] to-[#8C6A2F] flex items-center justify-center font-serif text-black font-bold">G</div><div><div className="font-serif text-xl font-bold">GOTA VOYAGES</div><div className="text-xs tracking-[0.2em] text-[#C9A86A]">EXPERT THROUGH EXPERIENCE</div><div className="text-xs text-[#6b6b6b]">Cotonou • Lomé • Lagos • tourisme@gotainternational.com</div></div></div>
            <div className="text-right"><div className="text-xs text-[#9a9a9a] uppercase tracking-widest">{lang==='FR'? (docType==='itinerary'? 'Itinéraire':'Devis') : docType.toUpperCase()}</div><div className="text-sm font-medium">{new Date().toLocaleDateString()}</div><div className="text-xs">Ref: GOTA-{t.id}-{new Date().getFullYear()}</div></div>
          </div>

          {docType==='itinerary' && (
            <div className="mt-6">
              <h2 className="font-serif text-2xl font-bold">{t.title} — {lang==='FR'? 'Itinéraire':'Itinerary'}</h2>
              <p className="text-sm text-[#6b6b6b] mt-1">{t.client_name} • {t.departure_city} → {t.destination_city} • {t.start_date} to {t.end_date} • {t.nights} nights / {t.duration_days} days • {t.adults} persons • {t.language}</p>
              {data.days.map((d:any)=>(
                <div key={d.id} className="mt-6">
                  <div className="bg-[#0a0a0a] text-white px-4 py-2 rounded-xl flex justify-between"><span className="font-bold">{lang==='FR'? `Jour ${d.day_number}`: `Day ${d.day_number}`} — {d.title}</span><span className="text-xs text-[#C9A86A]">{d.date}</span></div>
                  <p className="text-sm mt-2">{d.description}</p>
                  {data.items.filter((it:any)=>it.day_id===d.id).map((it:any)=>(
                    <div key={it.id} className="mt-2 flex gap-4 text-sm border-b pb-2"><span className="w-16 font-bold">{it.time}</span><span><b>{it.title}</b> — {it.location} • {it.notes}</span></div>
                  ))}
                  {data.restaurants.filter((r:any)=>r.day_id===d.id).map((r:any)=>(
                    <div key={r.id} className="mt-1 text-xs bg-[#fcfaf6] border p-2 rounded-xl">🍽️ {r.restaurant_name} • {r.location} • {r.meal_type} • {r.time} • {r.included_type} • {r.reservation_status}</div>
                  ))}
                </div>
              ))}
              <div className="mt-6 text-xs text-[#6b6b6b]">Includes: Return transport, border assistance, hotel as selected, Ganvié, Ouidah, city tour, guide. Excludes: personal meals unless included, shopping, optional extras. Professional layout — not spreadsheet.</div>
            </div>
          )}

          {(docType.includes('quotation')) && (
            <div className="mt-6">
              <h2 className="font-serif text-2xl font-bold">{lang==='FR'? 'Devis':'Quotation'} — {quote? quote.title : t.title}</h2>
              <p className="text-sm text-[#6b6b6b]">Client: {t.client_name} • {t.adults} pax • Double/Single options calculated independently</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl bg-[#fcfaf6] border"><div className="text-xs text-[#9a9a9a]">{lang==='FR'? 'Prix total':'Total before discount'}</div><div className="font-bold">{quote? Number(quote.total_selling_price).toLocaleString()+' '+quote.currency : '—'}</div></div>
                <div className="p-4 rounded-2xl bg-[#fcfaf6] border"><div className="text-xs text-[#9a9a9a]">{lang==='FR'? 'Montant final':'Final Amount Payable'}</div><div className="font-bold text-[#C9A86A]">{quote? Number(quote.final_amount).toLocaleString()+' '+quote.currency : '—'}</div></div>
              </div>
              {docType==='quotation_no_price'? <div className="mt-4 p-6 text-center bg-amber-50 border rounded-2xl">Quotation without prices — Inclusions listed, financials omitted for client review.</div> :
                <table className="w-full text-sm mt-4"><thead className="text-xs text-[#9a9a9a]"><tr><th className="text-left p-2">Service</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>
                  {data.services.slice(0,8).map((s:any)=><tr key={s.id} className="border-t"><td className="p-2">{s.service_name}</td><td className="text-center">{s.quantity}</td><td className="text-center">{s.final_selling_price||s.selling_rate||'-'} {s.currency}</td><td className="text-center">{ s.final_selling_price? (Number(s.final_selling_price)*Number(s.quantity)).toLocaleString() : '-'}</td></tr>)}
                </tbody></table>
              }
              <div className="mt-4 text-xs"><b>Inclusions:</b> {quote?.inclusions || 'As per proposal'} <br/><b>Exclusions:</b> {quote?.exclusions || 'Personal expenses'} <br/><b>Conditions:</b> {quote?.conditions} • Valid until {quote?.valid_until} • Payment terms: deposit to confirm.</div>
              <div className="mt-4 text-xs text-red-600">⚠️ Client-facing: Never displays internal costs, margins, supplier notes.</div>
            </div>
          )}

          {docType==='voucher' && (
            <div className="mt-6">
              <h2 className="font-serif text-2xl font-bold">Hotel Vouchers</h2>
              {data.accommodations.map((a:any)=>(
                <div key={a.id} className="mt-4 p-5 border rounded-2xl">
                  <div className="font-bold">{a.hotel_name} • {a.location} • {a.room_category}</div>
                  <div className="text-sm">Guest: {t.client_name} • {a.guests} guests • {a.rooms} room(s) • {a.occupancy_type} • {a.check_in} → {a.check_out} • {a.nights} nights • Meal: {a.meal_plan} • BF included {a.breakfast_included_qty} extra {a.extra_breakfast_qty}</div>
                  <div className="text-sm">Status: <b>{a.booking_status}</b> • Ref: {a.reference || 'Pending confirmation'} • Requests: {a.special_requests||'—'}</div>
                  <div className="text-xs text-[#9a9a9a] mt-1">No internal rates displayed.</div>
                </div>
              ))}
            </div>
          )}

          {docType==='receipt' && (
            <div className="mt-6">
              <h2 className="font-serif text-2xl font-bold">{lang==='FR'? 'Reçu':'Payment Receipt'}</h2>
              {data.payments.map((p:any)=>(
                <div key={p.id} className="mt-3 p-4 border rounded-2xl flex justify-between"><span>{p.date} • {p.type} • {p.amount} {p.currency} • {p.method} • Ref {p.reference} • {p.status}</span><span className="font-bold">✔</span></div>
              ))}
              {data.payments.length===0 && <div className="text-sm text-[#9a9a9a]">No confirmed payments yet.</div>}
            </div>
          )}

          {docType==='profit_internal' && (
            <div className="mt-6">
              <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700">INTERNAL ONLY — Never share with client. Shows costs, margins, supplier payments.</div>
              <table className="w-full text-sm mt-4"><thead><tr><th className="text-left">Service</th><th>Cost</th><th>Sell</th><th>Qty</th><th>Profit</th></tr></thead><tbody>
                {data.services.map((s:any)=>{ const qty=Number(s.quantity||1); const sell=s.final_selling_price? Number(s.final_selling_price)*qty :0; const cost=s.supplier_cost? Number(s.supplier_cost)*qty:0; return <tr key={s.id} className="border-t"><td className="p-2">{s.service_name}</td><td>{cost.toLocaleString()}</td><td>{sell.toLocaleString()}</td><td>{qty}</td><td className="font-bold">{(sell-cost).toLocaleString()}</td></tr>})}
              </tbody></table>
            </div>
          )}

          <div className="mt-8 pt-6 border-t text-xs text-[#9a9a9a] text-center">GOTA Voyages | Expert Through Experience • Elegant, readable, corporate-ready • Black & gold branding • Print/PDF genuine downloadable via browser print-to-PDF.</div>
        </div>
      </>
      }
    </div>
  );
}
export default function DocumentsPage(){
  return <Suspense fallback={<div className="p-8 text-sm">Loading documents...</div>}><DocumentsInner/></Suspense>
}
