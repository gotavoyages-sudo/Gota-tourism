import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
export async function POST(req:NextRequest){
  const b=await req.json();
  try{
    await db.execute(sql`insert into trip_accommodations (trip_id, hotel_master_id, hotel_name, location, room_category, rooms, occupancy_type, guests, check_in, check_out, nights, breakfast_included_qty, extra_breakfast_qty, extra_breakfast_price, meal_plan, supplier_cost, selling_rate, booking_status, reference, special_requests)
      values (${b.tripId}, ${b.hotelMasterId||null}, ${b.hotelName}, ${b.location}, ${b.roomCategory}, ${b.rooms||1}, ${b.occupancyType}, ${b.guests||null}, ${b.checkIn||null}, ${b.checkOut||null}, ${b.nights||1}, ${b.breakfastIncludedQty||0}, ${b.extraBreakfastQty||0}, ${b.extraBreakfastPrice||null}, ${b.mealPlan}, ${b.supplierCost||null}, ${b.sellingRate||null}, ${b.bookingStatus||'Pending'}, ${b.reference||''}, ${b.specialRequests||''})`);
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function DELETE(req:NextRequest){
  const {searchParams}=new URL(req.url);
  const id=searchParams.get("id");
  try{ await db.execute(sql`delete from trip_accommodations where id=${Number(id)}`); return NextResponse.json({ok:true});}catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
export async function PUT(req:NextRequest){
  const b=await req.json();
  try{
    await db.execute(sql`update trip_accommodations set hotel_name=${b.hotelName}, location=${b.location}, room_category=${b.roomCategory}, rooms=${b.rooms}, occupancy_type=${b.occupancyType}, guests=${b.guests}, check_in=${b.checkIn||null}, check_out=${b.checkOut||null}, nights=${b.nights}, breakfast_included_qty=${b.breakfastIncludedQty}, extra_breakfast_qty=${b.extraBreakfastQty}, extra_breakfast_price=${b.extraBreakfastPrice||null}, meal_plan=${b.mealPlan}, supplier_cost=${b.supplierCost||null}, selling_rate=${b.sellingRate||null}, booking_status=${b.bookingStatus}, reference=${b.reference}, special_requests=${b.specialRequests} where id=${b.id}`);
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
