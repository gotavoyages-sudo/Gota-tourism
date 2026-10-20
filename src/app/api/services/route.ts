import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function POST(req:NextRequest){
  const b=await req.json();
  try{
    await db.execute(sql`insert into trip_services (trip_id, service_name, category, supplier_cost, selling_rate, final_selling_price, quantity, pricing_basis, currency, classification, included_in_package, cost_covered, estimated_cost, actual_cost, estimated_revenue, actual_revenue, notes)
      values (${b.tripId}, ${b.serviceName}, ${b.category}, ${b.supplierCost||null}, ${b.sellingRate||null}, ${b.finalSellingPrice||null}, ${b.quantity||1}, ${b.pricingBasis}, ${b.currency}, ${b.classification}, ${b.includedInPackage||false}, ${b.costCovered||false}, ${b.estimatedCost||null}, ${b.actualCost||null}, ${b.estimatedRevenue||null}, ${b.actualRevenue||null}, ${b.notes})`);
    await db.execute(sql`insert into audit_logs (trip_id, action, details) values (${b.tripId}, 'Service added', ${b.serviceName})`);
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function DELETE(req:NextRequest){
  const {searchParams}=new URL(req.url);
  const id=searchParams.get("id");
  try{ await db.execute(sql`delete from trip_services where id=${Number(id)}`); return NextResponse.json({ok:true});}catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
export async function PUT(req:NextRequest){
  const b=await req.json();
  try{
    await db.execute(sql`update trip_services set service_name=${b.serviceName}, category=${b.category}, supplier_cost=${b.supplierCost||null}, selling_rate=${b.sellingRate||null}, final_selling_price=${b.finalSellingPrice||null}, quantity=${b.quantity}, pricing_basis=${b.pricingBasis}, currency=${b.currency}, classification=${b.classification}, included_in_package=${b.includedInPackage}, cost_covered=${b.costCovered}, estimated_cost=${b.estimatedCost||null}, actual_cost=${b.actualCost||null}, estimated_revenue=${b.estimatedRevenue||null}, actual_revenue=${b.actualRevenue||null}, notes=${b.notes} where id=${b.id}`);
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
