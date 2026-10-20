import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
export async function GET(req:NextRequest){
  const {searchParams}=new URL(req.url);
  const tripId=searchParams.get("tripId");
  try{
    if(tripId){
      const r=await db.execute(sql`select * from quotations where trip_id=${Number(tripId)} order by version desc`);
      return NextResponse.json(r.rows);
    }
    const r=await db.execute(sql`select q.*, t.title as trip_title, t.client_name from quotations q left join trips t on t.id=q.trip_id order by q.created_at desc limit 50`);
    return NextResponse.json(r.rows);
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function POST(req:NextRequest){
  const b=await req.json();
  try{
    const vres=await db.execute(sql`select coalesce(max(version),0)+1 as v from quotations where trip_id=${b.tripId}`);
    const version=(vres.rows as any[])[0]?.v||1;
    await db.execute(sql`insert into quotations (trip_id, version, title, language, status, total_selling_price, discount, additional_charges, final_amount, currency, inclusions, exclusions, optional_extras, conditions, valid_until)
      values (${b.tripId}, ${version}, ${b.title}, ${b.language||'EN'}, ${b.status||'Draft'}, ${b.totalSellingPrice||0}, ${b.discount||0}, ${b.additionalCharges||0}, ${b.finalAmount||0}, ${b.currency||'NGN'}, ${b.inclusions||''}, ${b.exclusions||''}, ${b.optionalExtras||''}, ${b.conditions||''}, ${b.validUntil||null})`);
    await db.execute(sql`insert into audit_logs (trip_id, action, details) values (${b.tripId}, 'Quotation created', ${'v'+version+' '+b.title})`);
    return NextResponse.json({ok:true, version});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function PUT(req:NextRequest){
  const b=await req.json();
  try{
    await db.execute(sql`update quotations set title=${b.title}, language=${b.language}, status=${b.status}, total_selling_price=${b.totalSellingPrice}, discount=${b.discount}, additional_charges=${b.additionalCharges}, final_amount=${b.finalAmount}, currency=${b.currency}, inclusions=${b.inclusions}, exclusions=${b.exclusions}, optional_extras=${b.optionalExtras}, conditions=${b.conditions}, valid_until=${b.validUntil||null} where id=${b.id}`);
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
