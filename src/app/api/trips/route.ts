import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trips, itineraryDays, itineraryItems, tripServices, tripAccommodations, auditLogs } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export async function GET(){
  try{
    const res = await db.execute(sql`select * from trips order by id desc`);
    return NextResponse.json(res.rows);
  }catch(e:any){ return NextResponse.json({error:e.message}, {status:500})}
}
export async function POST(req:NextRequest){
  try{
    const b = await req.json();
    const inserted = await db.execute(sql`
      insert into trips (title, client_name, client_email, client_phone, language, departure_country, destination_country, departure_city, destination_city, start_date, end_date, nights, duration_days, adults, children, infants, single_occupancy, double_occupancy, status, target_profit, expected_revenue, currency, exchange_rate, meal_plan, notes, assigned_to)
      values (${b.title}, ${b.clientName}, ${b.clientEmail}, ${b.clientPhone}, ${b.language||'EN'}, ${b.departureCountry||'Nigeria'}, ${b.destinationCountry||'Benin'}, ${b.departureCity||'Lagos'}, ${b.destinationCity||'Cotonou'}, ${b.startDate||null}, ${b.endDate||null}, ${b.nights||2}, ${b.durationDays||3}, ${b.adults||7}, ${b.children||0}, ${b.infants||0}, ${b.singleOccupancy||0}, ${b.doubleOccupancy||0}, ${b.status||'draft'}, ${b.targetProfit||550000}, ${b.expectedRevenue||0}, ${b.currency||'NGN'}, ${b.exchangeRate||2.5}, ${b.mealPlan||'custom'}, ${b.notes||''}, ${b.assignedTo||''})
      returning *
    `);
    const trip = (inserted.rows as any[])[0];
    // create demo itinerary days if title contains Cotonou
    if(trip){
      await db.execute(sql`insert into itinerary_days (trip_id, day_number, date, title, description, meals_included) values
        (${trip.id}, 1, ${trip.start_date||null}, 'LAGOS TO COTONOU & GANVIÉ EXPERIENCE', '6:00 AM pickup from Lagos. Departure for Seme border. Border protocol assistance. Arrival in Cotonou and hotel check-in. Ganvié boat tour and cultural experience. Free evening.', 'Lunch at leisure'),
        (${trip.id}, 2, null, 'COTONOU CITY TOUR & OUIDAH CULTURAL EXPERIENCE', '9:00 AM departure. Cotonou City Tour: Amazon Statue, Mural Wall, Bio Guerra Statue. Ouidah: Door of No Return, Temple of Python, Sacred Forest, Maison du Brésil, Fondation Zinsou. Lunch at Le Pas (guest expense unless included). Sunset at Fidjrossè/ Family Beach.', 'Breakfast'),
        (${trip.id}, 3, ${trip.end_date||null}, 'COTONOU TO LAGOS', 'Breakfast if applicable. Check-out. Arts & Crafts Market if time permits. Departure for Lagos with border assistance. Drop-off Lekki.', 'Breakfast')
      `);
      // add default services reflecting examples
      await db.execute(sql`insert into trip_services (trip_id, service_name, category, supplier_cost, selling_rate, final_selling_price, quantity, pricing_basis, currency, classification, notes)
        values
        (${trip.id}, 'Ganvié Experience Adult', 'activity', 12000, 20000, 20000, ${trip.adults||7}, 'per-person', 'FCFA', 'final_fixed_selling_price', 'Includes boat, tour, meal. Do not duplicate boat/meal.'),
        (${trip.id}, 'Ouidah Tour', 'activity', 4000, 10000, 10000, ${trip.adults||7}, 'per-person', 'FCFA', 'final_fixed_selling_price', 'Entrances per negotiated rate'),
        (${trip.id}, 'Nigeria-Benin 15-seater One-way', 'transport', 400000, 500000, 500000, 1, 'per-vehicle', 'NGN', 'final_fixed_selling_price', 'Pickup/drop-off one-way, 15-seater'),
        (${trip.id}, 'ECOWAS Border Protocol', 'border', 0, 10000, 10000, ${trip.adults||7}, 'per-person', 'FCFA', 'supplier_cost', 'Confirm per trip vs per crossing')
      `);
      await db.execute(sql`insert into audit_logs (trip_id, action, details) values (${trip.id}, 'Trip created', ${JSON.stringify(b)})`);
    }
    return NextResponse.json(trip);
  }catch(e:any){ return NextResponse.json({error:e.message}, {status:500})}
}
