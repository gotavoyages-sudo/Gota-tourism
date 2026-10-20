import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
export async function POST(req:NextRequest){
  const b=await req.json();
  try{
    if(b.action==='addItem'){
      await db.execute(sql`insert into itinerary_items (day_id, trip_id, time, title, type, location, duration, transport, notes, sort_order) values (${b.dayId}, ${b.tripId}, ${b.time||''}, ${b.title}, ${b.type||'activity'}, ${b.location||''}, ${b.duration||''}, ${b.transport||''}, ${b.notes||''}, ${b.sortOrder||0})`);
    } else if(b.action==='addDay'){
      await db.execute(sql`insert into itinerary_days (trip_id, day_number, date, title, description) values (${b.tripId}, ${b.dayNumber}, ${b.date||null}, ${b.title}, ${b.description||''})`);
    } else if(b.action==='updateItem'){
      await db.execute(sql`update itinerary_items set time=${b.time}, title=${b.title}, type=${b.type}, location=${b.location}, duration=${b.duration}, transport=${b.transport}, notes=${b.notes} where id=${b.id}`);
    } else if(b.action==='deleteItem'){
      await db.execute(sql`delete from itinerary_items where id=${b.id}`);
    } else if(b.action==='updateDay'){
      await db.execute(sql`update itinerary_days set title=${b.title}, description=${b.description}, date=${b.date||null} where id=${b.id}`);
    } else if(b.action==='deleteDay'){
      await db.execute(sql`delete from itinerary_days where id=${b.id}`);
    } else if(b.action==='moveItem'){
      await db.execute(sql`update itinerary_items set sort_order=${b.sortOrder} where id=${b.id}`);
    }
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
