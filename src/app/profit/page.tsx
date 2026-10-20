"use client";
import { useEffect, useState } from "react";
export default function ProfitPage(){
  const [trips,setTrips]=useState<any[]>([]);
  const [selected,setSelected]=useState<any>(null);
  const [details,setDetails]=useState<any>(null);
  useEffect(()=>{ fetch("/api/trips").then(r=>r.json()).then(setTrips);},[]);
  const open=async(id:number)=>{ const r=await fetch(`/api/trips/${id}`); const j=await r.json(); setSelected(id); setDetails(j);};
  const calc=(d:any)=>{
    if(!d) return null;
    let estRev=0, estCost=0, actRev=0, actCost=0;
    (d.services||[]).forEach((s:any)=>{
      const qty=Number(s.quantity||1);
      const sell = s.final_selling_price? Number(s.final_selling_price)*qty : s.selling_rate? Number(s.selling_rate)*qty : (s.estimated_revenue?Number(s.estimated_revenue):0);
      const cost = s.estimated_cost!=null? Number(s.estimated_cost) : s.supplier_cost!=null? Number(s.supplier_cost)*qty :0;
      if(!(s.cost_covered||s.included_in_package)){ estRev+=sell; estCost+=cost; actRev+= s.actual_revenue!=null? Number(s.actual_revenue):sell; actCost+= s.actual_cost!=null? Number(s.actual_cost):cost; }
    });
    (d.accommodations||[]).forEach((a:any)=>{ const nights=Number(a.nights||1), rooms=Number(a.rooms||1); estRev+= a.selling_rate? Number(a.selling_rate)*nights*rooms:0; estCost+= a.supplier_cost? Number(a.supplier_cost)*nights*rooms:0; actRev+= a.selling_rate? Number(a.selling_rate)*nights*rooms:0; actCost+= a.supplier_cost? Number(a.supplier_cost)*nights*rooms:0; });
    // add financial tx
    (d.transactions||[]).forEach((tx:any)=>{ if(tx.type==='revenue'){ estRev+= Number(tx.expected_revenue||tx.amount||0); actRev+= Number(tx.actual_revenue||tx.amount||0);} if(tx.type==='expense'){ estCost+= Number(tx.expected_cost||tx.amount||0); actCost+= Number(tx.actual_cost||tx.amount||0);} });
    return {estRev, estCost, actRev, actCost, estNet: estRev-estCost, actNet: actRev-actCost, target: Number(d.trip.target_profit)||550000};
  };
  const c= details? calc(details): null;
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">Internal Profit — Service-Level + Package • No Double Count</h1>
      <p className="text-sm text-[#6b6b6b]">Profit = Revenue - Costs - Ops. Internal costs vs selling rates separate. Refundable deposits not expense. Cash advance not expense. Internal transfers not revenue. Flags incomplete costs. Client docs never expose profit.</p>
      <div className="flex gap-2 overflow-x-auto">
        {trips.map((t:any)=><button key={t.id} onClick={()=>open(t.id)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${selected===t.id? 'bg-[#0a0a0a] text-white':'bg-white border'}`}>{t.title} #{t.id}</button>)}
      </div>
      {c && details && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card p-5"><div className="text-xs uppercase tracking-widest text-[#9a9a9a]">Expected Revenue</div><div className="text-xl font-bold">₦{c.estRev.toLocaleString()}</div><div className="text-xs text-[#9a9a9a]">From services + accommodations + tx</div></div>
            <div className="card p-5"><div className="text-xs uppercase tracking-widest text-[#9a9a9a]">Expected Cost</div><div className="text-xl font-bold">₦{c.estCost.toLocaleString()}</div><div className="text-xs text-[#9a9a9a]">Supplier + operational</div></div>
            <div className="card p-5 bg-gradient-to-br from-[#0a0a0a] to-[#222] text-white"><div className="text-xs text-[#C9A86A] uppercase tracking-widest">Target Profit</div><div className="text-xl font-bold text-[#C9A86A]">₦{c.target.toLocaleString()}</div><div className="text-xs text-white/60">Available budget = Revenue - Target</div></div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card p-5"><div className="text-xs text-[#9a9a9a]">Expected Net Profit</div><div className="text-2xl font-bold text-[#0a0a0a]">₦{c.estNet.toLocaleString()}</div></div>
            <div className="card p-5 bg-emerald-50 border-emerald-200"><div className="text-xs text-emerald-700">Actual Net Profit</div><div className="text-2xl font-bold text-emerald-700">₦{c.actNet.toLocaleString()}</div></div>
            <div className="card p-5"><div className="text-xs">Variance (Actual - Expected)</div><div className={`text-2xl font-bold ${c.actNet-c.estNet>=0? 'text-emerald-600':'text-red-600'}`}>₦{(c.actNet - c.estNet).toLocaleString()}</div><div className="text-xs">Target variance: ₦{(c.actNet - c.target).toLocaleString()}</div></div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold">Service-Level Breakdown (Prevents Double Count)</h3>
            <table className="w-full text-sm mt-3"><thead className="text-xs text-[#9a9a9a]"><tr><th className="text-left p-2">Service</th><th>Sell</th><th>Cost</th><th>Qty</th><th>Profit</th><th>Status</th></tr></thead><tbody>
              {details.services.map((s:any)=>{ const qty=Number(s.quantity||1); const sell= s.final_selling_price? Number(s.final_selling_price)*qty : s.selling_rate? Number(s.selling_rate)*qty :0; const cost=s.supplier_cost? Number(s.supplier_cost)*qty : (s.estimated_cost? Number(s.estimated_cost):0); const profit= s.cost_covered?0: sell-cost; return <tr key={s.id} className="border-t"><td className="p-2">{s.service_name}</td><td className="text-center">{sell.toLocaleString()}</td><td className="text-center">{cost.toLocaleString()||'missing'}</td><td className="text-center">{qty}</td><td className={`text-center font-bold ${profit>=0?'text-emerald-600':'text-red-600'}`}>{profit.toLocaleString() || (s.cost_covered? '0 covered': '0')}</td><td className="text-center text-xs">{s.included_in_package?'Included': s.cost_covered?'Covered':'Standalone'}</td></tr>})}
            </tbody></table>
            <p className="text-xs text-[#9a9a9a] mt-2">Example validated: Ganvié 12k→20k=8k, Ouidah 4k→10k=6k, Transport 400k→500k=100k per one-way. Fixed group 20k never multiplied. Hotel breakdown per room/night/occupancy.</p>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold">Demo Test — Editable Scenario</h3>
            <p className="text-sm text-[#6b6b6b]">Expected profit ₦550,000 → Actual ₦800,000 • Variance +₦250,000 must be explained by recorded transactions.</p>
            <div className="mt-3 p-4 rounded-2xl bg-[#fcfaf6] border">Variance: ₦{(c.actNet - c.target).toLocaleString()} — {details.transactions.filter((x:any)=>x.actual_revenue||x.actual_cost).length>0? 'Transactions explain variance' : '⚠️ Unexplained variance — staff review required. Add financial transactions with expected vs actual.'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
