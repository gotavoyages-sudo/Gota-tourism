import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET(req:NextRequest, {params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  try{
    const trip = await db.execute(sql`select * from trips where id=${Number(id)}`);
    const services = await db.execute(sql`select * from trip_services where trip_id=${Number(id)} order by id`);
    const accoms = await db.execute(sql`select * from trip_accommodations where trip_id=${Number(id)} order by id`);
    const days = await db.execute(sql`select * from itinerary_days where trip_id=${Number(id)} order by day_number`);
    const items = await db.execute(sql`select * from itinerary_items where trip_id=${Number(id)} order by sort_order, id`);
    const payments = await db.execute(sql`select * from payments where trip_id=${Number(id)} order by date desc`);
    const tx = await db.execute(sql`select * from financial_transactions where trip_id=${Number(id)} order by date desc, id desc`);
    const cash = await db.execute(sql`select * from cash_advances where trip_id=${Number(id)} order by date`);
    const quotes = await db.execute(sql`select * from quotations where trip_id=${Number(id)} order by version desc`);
    const restaurants = await db.execute(sql`select * from trip_restaurants where trip_id=${Number(id)} order by id`);
    const audit = await db.execute(sql`select * from audit_logs where trip_id=${Number(id)} order by created_at desc limit 20`);
    return NextResponse.json({
      trip: (trip.rows as any[])[0]||null,
      services: services.rows,
      accommodations: accoms.rows,
      days: days.rows,
      items: items.rows,
      payments: payments.rows,
      transactions: tx.rows,
      cash: cash.rows,
      quotations: quotes.rows,
      restaurants: restaurants.rows,
      audit: audit.rows
    });
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function PUT(req:NextRequest, {params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  try{
    const b=await req.json();
    await db.execute(sql`update trips set
      title=${b.title}, client_name=${b.clientName}, client_email=${b.clientEmail}, client_phone=${b.clientPhone},
      language=${b.language}, departure_country=${b.departureCountry}, destination_country=${b.destinationCountry},
      departure_city=${b.departureCity}, destination_city=${b.destinationCity},
      start_date=${b.startDate||null}, end_date=${b.endDate||null}, nights=${b.nights}, duration_days=${b.durationDays},
      adults=${b.adults}, children=${b.children}, infants=${b.infants}, single_occupancy=${b.singleOccupancy}, double_occupancy=${b.doubleOccupancy},
      status=${b.status}, target_profit=${b.targetProfit}, expected_revenue=${b.expectedRevenue}, currency=${b.currency}, exchange_rate=${b.exchangeRate}, meal_plan=${b.mealPlan}, notes=${b.notes}, assigned_to=${b.assignedTo}, updated_at=now()
      where id=${Number(id)}`);
    await db.execute(sql`insert into audit_logs (trip_id, action, details) values (${Number(id)}, 'Trip updated', ${JSON.stringify(b).slice(0,1000)})`);
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function DELETE(req:NextRequest, {params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  try{
    await db.execute(sql`delete from trips where id=${Number(id)}`);
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
