import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
export async function GET(){
  try{
    const r=await db.execute(sql`select * from settings`);
    const obj:any={};
    (r.rows as any[]).forEach(row=> obj[row.key]=row.value);
    return NextResponse.json(obj);
  }catch(e:any){ return NextResponse.json({})}
}
export async function POST(req:NextRequest){
  const b=await req.json();
  try{
    for(const k of Object.keys(b)){
      await db.execute(sql`insert into settings (key, value) values (${k}, ${String(b[k])}) on conflict (key) do update set value=${String(b[k])}`);
    }
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
