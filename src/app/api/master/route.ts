import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET(req:NextRequest){
  const {searchParams}=new URL(req.url);
  const type=searchParams.get("type");
  try{
    if(type==='hotels'){ const r=await db.execute(sql`select * from hotels_master order by country, name`); return NextResponse.json(r.rows); }
    if(type==='activities'){ const r=await db.execute(sql`select * from activities_master order by country, name`); return NextResponse.json(r.rows); }
    if(type==='vehicles'){ const r=await db.execute(sql`select * from vehicles_master order by capacity, name`); return NextResponse.json(r.rows); }
    if(type==='restaurants'){ const r=await db.execute(sql`select * from restaurants_master order by destination, name`); return NextResponse.json(r.rows); }
    if(type==='guides'){ const r=await db.execute(sql`select * from guides_master order by name`); return NextResponse.json(r.rows); }
    if(type==='border'){ const r=await db.execute(sql`select * from border_services_master order by name`); return NextResponse.json(r.rows); }
    // all
    const hotels=await db.execute(sql`select * from hotels_master order by name`);
    const activities=await db.execute(sql`select * from activities_master order by name`);
    const vehicles=await db.execute(sql`select * from vehicles_master order by name`);
    const restaurants=await db.execute(sql`select * from restaurants_master order by name`);
    return NextResponse.json({hotels:hotels.rows, activities:activities.rows, vehicles:vehicles.rows, restaurants:restaurants.rows});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function POST(req:NextRequest){
  const b=await req.json();
  try{
    if(b.table==='hotels_master'){
      await db.execute(sql`insert into hotels_master (name, country, city, category, rate, currency, pricing_basis, classification, supplier_cost, selling_rate, breakfast_price, notes) values (${b.name}, ${b.country}, ${b.city}, ${b.category}, ${b.rate||null}, ${b.currency}, ${b.pricingBasis}, ${b.classification}, ${b.supplierCost||null}, ${b.sellingRate||null}, ${b.breakfastPrice||null}, ${b.notes||''})`);
    } else if(b.table==='activities_master'){
      await db.execute(sql`insert into activities_master (name, country, currency, pricing_basis, classification, supplier_cost, selling_price, per_person, fixed_group_price, notes) values (${b.name}, ${b.country}, ${b.currency}, ${b.pricingBasis}, ${b.classification}, ${b.supplierCost||null}, ${b.sellingPrice||null}, ${b.perPerson}, ${b.fixedGroupPrice}, ${b.notes||''})`);
    } else if(b.table==='vehicles_master'){
      await db.execute(sql`insert into vehicles_master (name, capacity, currency, rate, pricing_basis, classification, supplier_cost, selling_price, inclusions, notes) values (${b.name}, ${b.capacity||null}, ${b.currency}, ${b.rate||null}, ${b.pricingBasis}, ${b.classification}, ${b.supplierCost||null}, ${b.sellingPrice||null}, ${b.inclusions||''}, ${b.notes||''})`);
    } else if(b.table==='restaurants_master'){
      await db.execute(sql`insert into restaurants_master (name, destination, cuisine, meal_type, cost_per_person, currency, classification, included_type, notes) values (${b.name}, ${b.destination}, ${b.cuisine}, ${b.mealType}, ${b.costPerPerson||null}, ${b.currency}, ${b.classification}, ${b.includedType}, ${b.notes||''})`);
    } else if(b.table==='guides_master'){
      await db.execute(sql`insert into guides_master (name, currency, rate, duration, classification, supplier_cost, selling_price, notes) values (${b.name}, ${b.currency}, ${b.rate||null}, ${b.duration}, ${b.classification}, ${b.supplierCost||null}, ${b.sellingPrice||null}, ${b.notes||''})`);
    } else if(b.table==='border_services_master'){
      await db.execute(sql`insert into border_services_master (name, category, currency, rate, pricing_basis, classification, notes) values (${b.name}, ${b.category}, ${b.currency}, ${b.rate||null}, ${b.pricingBasis}, ${b.classification}, ${b.notes||''})`);
    }
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function PUT(req:NextRequest){
  const b=await req.json();
  try{
    if(b.table==='hotels_master'){
      await db.execute(sql`update hotels_master set name=${b.name}, country=${b.country}, city=${b.city}, category=${b.category}, rate=${b.rate||null}, currency=${b.currency}, pricing_basis=${b.pricingBasis}, classification=${b.classification}, supplier_cost=${b.supplierCost||null}, selling_rate=${b.sellingRate||null}, breakfast_price=${b.breakfastPrice||null}, notes=${b.notes} where id=${b.id}`);
    } else if(b.table==='activities_master'){
      await db.execute(sql`update activities_master set name=${b.name}, country=${b.country}, currency=${b.currency}, pricing_basis=${b.pricingBasis}, classification=${b.classification}, supplier_cost=${b.supplierCost||null}, selling_price=${b.sellingPrice||null}, notes=${b.notes} where id=${b.id}`);
    } else if(b.table==='vehicles_master'){
      await db.execute(sql`update vehicles_master set name=${b.name}, capacity=${b.capacity}, currency=${b.currency}, rate=${b.rate||null}, pricing_basis=${b.pricingBasis}, classification=${b.classification}, supplier_cost=${b.supplierCost||null}, selling_price=${b.sellingPrice||null}, inclusions=${b.inclusions}, notes=${b.notes} where id=${b.id}`);
    } else if(b.table==='restaurants_master'){
      await db.execute(sql`update restaurants_master set name=${b.name}, destination=${b.destination}, cuisine=${b.cuisine}, meal_type=${b.mealType}, cost_per_person=${b.costPerPerson||null}, currency=${b.currency}, classification=${b.classification}, included_type=${b.includedType}, notes=${b.notes} where id=${b.id}`);
    }
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
export async function DELETE(req:NextRequest){
  const {searchParams}=new URL(req.url);
  const id=searchParams.get("id");
  const table=searchParams.get("table");
  try{ await db.execute(sql`delete from ${sql.raw(table as string)} where id=${Number(id)}`); return NextResponse.json({ok:true});}catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
