import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function POST(req:NextRequest){
  const b=await req.json();
  try{
    await db.execute(sql`insert into financial_transactions (trip_id, description, category, amount, currency, type, quantity, unit, supplier, expected_cost, revised_cost, actual_cost, expected_revenue, actual_revenue, amount_paid, status, included_in_package, cost_covered, payment_method, reference, date, staff_member, notes)
      values (${b.tripId}, ${b.description}, ${b.category}, ${b.amount||null}, ${b.currency}, ${b.type}, ${b.quantity||1}, ${b.unit||''}, ${b.supplier||''}, ${b.expectedCost||null}, ${b.revisedCost||null}, ${b.actualCost||null}, ${b.expectedRevenue||null}, ${b.actualRevenue||null}, ${b.amountPaid||null}, ${b.status||'estimated'}, ${b.includedInPackage||false}, ${b.costCovered||false}, ${b.paymentMethod||''}, ${b.reference||''}, ${b.date||null}, ${b.staffMember||''}, ${b.notes||''})`);
    await db.execute(sql`insert into audit_logs (trip_id, action, details) values (${b.tripId}, 'Financial tx: '||${b.type}, ${b.description})`);
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function DELETE(req:NextRequest){
  const {searchParams}=new URL(req.url);
  try{ await db.execute(sql`delete from financial_transactions where id=${Number(searchParams.get("id"))}`); return NextResponse.json({ok:true});}catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
export async function PUT(req:NextRequest){
  const b=await req.json();
  try{
    await db.execute(sql`update financial_transactions set description=${b.description}, category=${b.category}, amount=${b.amount||null}, currency=${b.currency}, type=${b.type}, quantity=${b.quantity}, unit=${b.unit}, supplier=${b.supplier}, expected_cost=${b.expectedCost||null}, revised_cost=${b.revisedCost||null}, actual_cost=${b.actualCost||null}, expected_revenue=${b.expectedRevenue||null}, actual_revenue=${b.actualRevenue||null}, amount_paid=${b.amountPaid||null}, status=${b.status}, included_in_package=${b.includedInPackage}, cost_covered=${b.costCovered}, payment_method=${b.paymentMethod}, reference=${b.reference}, date=${b.date||null}, staff_member=${b.staffMember}, notes=${b.notes} where id=${b.id}`);
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
