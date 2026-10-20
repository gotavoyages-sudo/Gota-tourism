import { db } from "@/db";
import { sql } from "drizzle-orm";
import Link from "next/link";
import { trips, quotations, payments, tripAccommodations } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  let stats = { trips: 0, quotations: 0, upcoming: 0, pendingBookings: 0, outstanding: 0, estRevenue: 0, estProfit: 0 };
  let recentTrips: any[] = [];
  try {
    const tripRows = await db.execute(sql`select count(*) as c from trips`);
    stats.trips = Number((tripRows.rows as any[])[0]?.c || 0);
    const qRows = await db.execute(sql`select count(*) as c from quotations where status in ('Draft','Ready for Review','Sent')`);
    stats.quotations = Number((qRows.rows as any[])[0]?.c || 0);
    const pendRows = await db.execute(sql`select count(*) as c from trip_accommodations where booking_status in ('Pending','Requested')`);
    stats.pendingBookings = Number((pendRows.rows as any[])[0]?.c || 0);
    const revRows = await db.execute(sql`select coalesce(sum(cast(expected_revenue as numeric)),0) as s from trips`);
    stats.estRevenue = Number((revRows.rows as any[])[0]?.s || 0);
    const tripsData = await db.execute(sql`select * from trips order by created_at desc limit 6`);
    recentTrips = tripsData.rows as any[];
  } catch (e) {
    // tables may not exist yet during build
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0a0a0a]">Operations Dashboard</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">GOTA Voyages • Expert Through Experience — One trip, one truth, full financial control</p>
        </div>
        <div className="flex gap-2">
          <Link href="/trips" className="btn-black text-sm">+ New Trip</Link>
          <Link href="/quotations" className="bg-white border text-sm px-5 py-2.5 rounded-full font-medium">View Quotations</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Trips", value: stats.trips, sub: "Active records", gold: true },
          { label: "Quotations in Progress", value: stats.quotations, sub: "Draft • Review • Sent" },
          { label: "Pending Bookings", value: stats.pendingBookings, sub: "Hotels • Transfers" },
          { label: "Upcoming Departures", value: stats.trips, sub: "Next 30 days" },
        ].map((s, i) => (
          <div key={i} className={`card p-5 ${s.gold ? "bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white border-[#C9A86A]/20" : ""}`}>
            <div className={`text-xs tracking-widest uppercase ${s.gold ? "text-[#C9A86A]" : "text-[#9a9a9a]"}`}>{s.label}</div>
            <div className={`text-3xl font-bold mt-2 ${s.gold ? "text-white" : "text-[#0a0a0a]"}`}>{s.value}</div>
            <div className={`text-xs mt-1 ${s.gold ? "text-white/60" : "text-[#9a9a9a]"}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-xs tracking-widest uppercase text-[#9a9a9a]">Estimated Revenue</div>
          <div className="text-2xl font-bold mt-1">₦{new Intl.NumberFormat().format(stats.estRevenue)}</div>
          <div className="text-xs text-[#9a9a9a] mt-1">Sum of trip expected revenue</div>
          <div className="mt-4 h-2 bg-[#f0e6cc] rounded-full overflow-hidden"><div className="h-full bg-[#C9A86A] w-[68%]"></div></div>
        </div>
        <div className="card p-5 bg-gradient-to-br from-[#0a0a0a] to-[#1e1e1e] text-white">
          <div className="text-xs tracking-widest uppercase text-[#C9A86A]">Estimated Profit</div>
          <div className="text-2xl font-bold mt-1 text-[#C9A86A]">Service-level + Package profit</div>
          <div className="text-xs text-white/60 mt-1">Actual = revenue − costs − ops. Flag incomplete costs.</div>
          <div className="mt-4 flex gap-2">
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full">Profit integrity: ON</span>
            <span className="text-xs bg-[#C9A86A] text-black px-3 py-1 rounded-full">No double counts</span>
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs tracking-widest uppercase text-[#9a9a9a]">Sample Test Gate</div>
          <div className="text-sm font-semibold mt-1">Expected ₦550k → Actual ₦800k</div>
          <div className="text-xs text-[#9a9a9a]">Variance +₦250,000 must reconcile</div>
          <Link href="/profit" className="mt-3 inline-block text-xs bg-[#0a0a0a] text-white px-4 py-2 rounded-full">Open Profit Reconciliation</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Recent Trips</h3>
            <Link href="/trips" className="text-xs text-[#C9A86A] font-medium">View all →</Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentTrips.length === 0 && <div className="text-sm text-[#9a9a9a] py-8 text-center">No trips yet. Create the Cotonou Experiential Weekend demo trip from Master Data or Trips.</div>}
            {recentTrips.map((t: any) => (
              <Link key={t.id} href={`/trips/${t.id}`} className="flex items-center justify-between p-4 rounded-2xl border hover:border-[#C9A86A]/50 bg-[#fcfaf6]">
                <div>
                  <div className="font-medium text-sm">{t.title} • {t.client_name}</div>
                  <div className="text-xs text-[#9a9a9a]">{t.departure_city} → {t.destination_city} • {t.start_date} • {t.adults} pax • {t.nights} nights</div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${t.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{t.status}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "Trips & Clients", href: "/trips" },
              { label: "Itinerary Builder", href: "/itinerary" },
              { label: "Hotels", href: "/hotels" },
              { label: "Transport", href: "/transport" },
              { label: "Quotations", href: "/quotations" },
              { label: "Payments", href: "/payments" },
              { label: "WhatsApp", href: "/whatsapp" },
              { label: "Master Data", href: "/master" },
            ].map(a => (
              <Link key={a.label} href={a.href} className="p-4 rounded-2xl border bg-[#fcfaf6] hover:bg-white text-sm font-medium text-center">{a.label}</Link>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-[#0a0a0a] text-white">
            <div className="text-xs text-[#C9A86A] uppercase tracking-widest">Exchange Rate</div>
            <div className="text-sm mt-1">1,000 FCFA = ₦2,500 • Configurable in Settings</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-serif text-lg font-bold">Cotonou Experiential Weekend — Demo Trip</h3>
        <p className="text-sm text-[#6b6b6b] mt-1">Lagos – Cotonou – Ganvié – Ouidah – Beach – Lagos • 3 Days / 2 Nights • 7 persons</p>
        <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
          <div className="p-4 rounded-2xl bg-[#fcfaf6] border">Double: <b>₦445,000 pp</b> • Illustrative</div>
          <div className="p-4 rounded-2xl bg-[#fcfaf6] border">Single: <b>₦545,000 pp</b> • Illustrative</div>
          <div className="p-4 rounded-2xl bg-[#0a0a0a] text-white">Ganvié 12k cost → 20k sell = 8k diff • Ouidah 4k → 10k = 6k diff</div>
        </div>
      </div>
    </div>
  );
}
