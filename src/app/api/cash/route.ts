import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
export async function POST(req:NextRequest){
  const b=await req.json();
  try{
    await db.execute(sql`insert into cash_advances (trip_id, amount, currency, recipient, date, type, status, notes) values (${b.tripId}, ${b.amount}, ${b.currency||'NGN'}, ${b.recipient}, ${b.date||null}, ${b.type}, ${b.status||'pending'}, ${b.notes||''})`);
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function DELETE(req:NextRequest){
  const {searchParams}=new URL(req.url);
  try{ await db.execute(sql`delete from cash_advances where id=${Number(searchParams.get("id"))}`); return NextResponse.json({ok:true});}catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
