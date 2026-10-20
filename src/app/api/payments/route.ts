import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
export async function GET(req:NextRequest){
  const {searchParams}=new URL(req.url);
  const tripId=searchParams.get("tripId");
  try{
    if(tripId){
      const r=await db.execute(sql`select * from payments where trip_id=${Number(tripId)} order by date desc`);
      return NextResponse.json(r.rows);
    }
    const r=await db.execute(sql`select p.*, t.title as trip_title from payments p left join trips t on t.id=p.trip_id order by p.date desc limit 100`);
    return NextResponse.json(r.rows);
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function POST(req:NextRequest){
  const b=await req.json();
  try{
    await db.execute(sql`insert into payments (trip_id, type, payer_type, amount, currency, method, date, reference, status, notes)
      values (${b.tripId}, ${b.type}, ${b.payerType}, ${b.amount}, ${b.currency}, ${b.method}, ${b.date||null}, ${b.reference}, ${b.status||'confirmed'}, ${b.notes||''})`);
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function DELETE(req:NextRequest){
  const {searchParams}=new URL(req.url);
  try{ await db.execute(sql`delete from payments where id=${Number(searchParams.get("id"))}`); return NextResponse.json({ok:true});}catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
