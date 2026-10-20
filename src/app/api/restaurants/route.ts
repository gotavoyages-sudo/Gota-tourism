import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
export async function POST(req:NextRequest){
  const b=await req.json();
  try{
    await db.execute(sql`insert into trip_restaurants (trip_id, day_id, restaurant_name, location, meal_type, time, duration, budget_per_person, included_type, reservation_status, notes)
      values (${b.tripId}, ${b.dayId||null}, ${b.restaurantName}, ${b.location||''}, ${b.mealType}, ${b.time||''}, ${b.duration||''}, ${b.budgetPerPerson||null}, ${b.includedType}, ${b.reservationStatus||'Suggested'}, ${b.notes||''})`);
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function DELETE(req:NextRequest){
  const {searchParams}=new URL(req.url);
  try{ await db.execute(sql`delete from trip_restaurants where id=${Number(searchParams.get("id"))}`); return NextResponse.json({ok:true});}catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
