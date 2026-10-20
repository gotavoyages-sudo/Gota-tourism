import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function POST(){
  try{
    // Ensure single staff login exists (only one)
    const existingUser = await db.execute(sql`select id from users limit 1`);
    if((existingUser.rows as any[]).length===0){
      const crypto = await import("crypto");
      const hash = crypto.createHash("sha256").update("gota-salt-v2"+"Gota2026!").digest("hex");
      await db.execute(sql`insert into users (email, password_hash, name, role) values ('tourisme@gotainternational.com', ${hash}, 'GOTA Admin', 'administrator')`);
    } else if((existingUser.rows as any[]).length>1){
      // enforce only one login - keep first, delete extras
      await db.execute(sql`delete from users where id not in (select min(id) from users)`);
    }
    // Hotels Benin
    await db.execute(sql`delete from hotels_master`);
    await db.execute(sql`delete from activities_master`);
    await db.execute(sql`delete from vehicles_master`);
    await db.execute(sql`delete from guides_master`);
    await db.execute(sql`delete from border_services_master`);
    await db.execute(sql`delete from restaurants_master`);

    // Benin Hotels
    await db.execute(sql`insert into hotels_master (name, country, city, category, rate, currency, pricing_basis, classification, notes) values
      ('Benin Royal', 'Benin', 'Cotonou', 'To be confirmed', 65000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', 'Starting price per room per night'),
      ('Azalaï Hotel Cotonou - Standard Room', 'Benin', 'Cotonou', 'Standard Room', 70000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Azalaï - Comfort / Superior Room', 'Benin', 'Cotonou', 'Comfort / Superior', 115000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Azalaï - Standard Terrace / Balcony', 'Benin', 'Cotonou', 'Standard Terrace / Balcony', 152000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Azalaï - Junior Suite', 'Benin', 'Cotonou', 'Junior Suite', 215000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Azalaï - Prestige Suite with Jacuzzi', 'Benin', 'Cotonou', 'Prestige Suite with Jacuzzi', 220000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Azalaï - Opera Suite', 'Benin', 'Cotonou', 'Opera Suite', 315000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Azalaï Breakfast', 'Benin', 'Cotonou', 'Meal - Breakfast', 15000, 'FCFA', 'per-person-per-meal', 'supplier_cost', 'Per person per meal'),
      ('Azalaï Lunch', 'Benin', 'Cotonou', 'Meal - Lunch', 20000, 'FCFA', 'per-person-per-meal', 'supplier_cost', ''),
      ('Azalaï Dinner', 'Benin', 'Cotonou', 'Meal - Dinner', 20000, 'FCFA', 'per-person-per-meal', 'supplier_cost', ''),
      ('Casa Del Papa - Privilège Double Sea View', 'Benin', 'Ouidah', 'Privilège Double Sea View', 160000, 'FCFA', 'per-room-per-night', 'final_fixed_selling_price', 'GOTA selling rate, not supplier cost'),
      ('Casa Del Papa - Privilège Single Sea View', 'Benin', 'Ouidah', 'Privilège Single Sea View', 157500, 'FCFA', 'per-room-per-night', 'final_fixed_selling_price', 'GOTA selling rate'),
      ('Casa Del Papa - Superior Pool Double Sea View', 'Benin', 'Ouidah', 'Superior Pool Double Sea View', 105500, 'FCFA', 'per-room-per-night', 'final_fixed_selling_price', ''),
      ('Casa Del Papa - Superior Pool Single Sea View', 'Benin', 'Ouidah', 'Superior Pool Single Sea View', 104000, 'FCFA', 'per-room-per-night', 'final_fixed_selling_price', ''),
      ('Casa Del Papa - Standard Double Sea View', 'Benin', 'Ouidah', 'Standard Double Sea View', 86000, 'FCFA', 'per-room-per-night', 'final_fixed_selling_price', ''),
      ('Casa Del Papa - Standard Single Sea View', 'Benin', 'Ouidah', 'Standard Single Sea View', 84500, 'FCFA', 'per-room-per-night', 'final_fixed_selling_price', ''),
      ('Casa Del Papa - Standard Double Lagoon View', 'Benin', 'Ouidah', 'Standard Double Lagoon View', 74000, 'FCFA', 'per-room-per-night', 'final_fixed_selling_price', ''),
      ('Casa Del Papa - Standard Single Lagoon View', 'Benin', 'Ouidah', 'Standard Single Lagoon View', 72500, 'FCFA', 'per-room-per-night', 'final_fixed_selling_price', ''),
      ('Amazon Hotel / Katijak Beach Option 1', 'Benin', 'Cotonou', 'Option 1', 40000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Amazon Hotel / Katijak Beach Option 2', 'Benin', 'Cotonou', 'Option 2', 50000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Amazon Hotel / Katijak Beach Option 3', 'Benin', 'Cotonou', 'Option 3', 54000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Amazon Extra Breakfast', 'Benin', 'Cotonou', 'Extra breakfast', 4000, 'FCFA', 'per-person-per-meal', 'supplier_cost', ''),
      ('Hotel Galilée Option 1', 'Benin', 'Cotonou', 'Option 1', 30000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Hotel Galilée Option 2', 'Benin', 'Cotonou', 'Option 2', 40000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Hotel Galilée Option 3', 'Benin', 'Cotonou', 'Option 3', 49000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Hotel Galilée Extra Breakfast', 'Benin', 'Cotonou', 'Extra breakfast', 4500, 'FCFA', 'per-person-per-meal', 'supplier_cost', ''),
      ('Mimi Apartments Fidjrossè 2-bed', 'Benin', 'Cotonou', 'Two-bedroom apartment', 50000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', 'Fidjrossè'),
      ('Mimi Apartments Jericho 2-room', 'Benin', 'Cotonou', 'Two-room apartment', 65000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', 'Jericho'),
      ('Mimi Apartments PK3', 'Benin', 'Cotonou', 'Starting rate - To be confirmed', 78000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', 'Apartment configuration to be confirmed')
    `);

    // Togo Hotels
    await db.execute(sql`insert into hotels_master (name, country, city, category, rate, currency, pricing_basis, classification, notes) values
      ('Miadjoe Beach Resort', 'Togo', 'Lomé', 'Starting rate', 60000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Alize Plage Option 1', 'Togo', 'Lomé', 'Option 1', 40000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Alize Plage Option 2', 'Togo', 'Lomé', 'Option 2', 50000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Alize Plage Option 3', 'Togo', 'Lomé', 'Option 3', 54000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Onomo Hotel Option 1', 'Togo', 'Lomé', 'Option 1', 80000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Onomo Hotel Option 2', 'Togo', 'Lomé', 'Option 2', 100000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Onomo Extra Breakfast', 'Togo', 'Lomé', 'Extra breakfast', 13000, 'FCFA', 'per-person-per-meal', 'supplier_cost', ''),
      ('Blue Turtle Weekday', 'Togo', 'Lomé', 'Weekday rate', 95000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', 'Select weekday/weekend per dates'),
      ('Blue Turtle Weekend', 'Togo', 'Lomé', 'Weekend rate', 115000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Blue Turtle Breakfast', 'Togo', 'Lomé', 'Breakfast', 10000, 'FCFA', 'per-person-per-meal', 'supplier_cost', ''),
      ('Petit Brussel Option 1', 'Togo', 'Lomé', 'Option 1', 80000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Petit Brussel Option 2', 'Togo', 'Lomé', 'Option 2', 90000, 'FCFA', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Petit Brussel Breakfast', 'Togo', 'Lomé', 'Breakfast', 9500, 'FCFA', 'per-person-per-meal', 'supplier_cost', '')
    `);

    // Nigeria Hotels
    await db.execute(sql`insert into hotels_master (name, country, city, category, rate, currency, pricing_basis, classification, notes) values
      ('Albergo Option 1', 'Nigeria', 'Lagos', 'Option 1', 190000, 'NGN', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Albergo Option 2', 'Nigeria', 'Lagos', 'Option 2', 220000, 'NGN', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Albergo Extra Breakfast', 'Nigeria', 'Lagos', 'Extra breakfast', 25000, 'NGN', 'per-person-per-meal', 'supplier_cost', ''),
      ('Lilygate Option 1', 'Nigeria', 'Lagos', 'Option 1', 180000, 'NGN', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Lilygate Option 2', 'Nigeria', 'Lagos', 'Option 2', 190000, 'NGN', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Lilygate Extra Breakfast', 'Nigeria', 'Lagos', 'Extra breakfast', 23000, 'NGN', 'per-person-per-meal', 'supplier_cost', ''),
      ('Eko Gardens Classic', 'Nigeria', 'Lagos', 'Classic Room', 200000, 'NGN', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Eko Gardens Superior', 'Nigeria', 'Lagos', 'Superior Room', 220000, 'NGN', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Eko Hotel Main Building Option 1', 'Nigeria', 'Lagos', 'Option 1', 270000, 'NGN', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Eko Hotel Main Building Option 2', 'Nigeria', 'Lagos', 'Option 2', 290000, 'NGN', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Eko Hotel Main Building Option 3', 'Nigeria', 'Lagos', 'Option 3', 350000, 'NGN', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Eko Hotel Breakfast', 'Nigeria', 'Lagos', 'Breakfast', 35000, 'NGN', 'per-person-per-meal', 'supplier_cost', ''),
      ('24/7 Luxury Starting rate', 'Nigeria', 'Lagos', 'Starting rate', 70000, 'NGN', 'per-room-per-night', 'starting_customer_rate', 'Generic room category')
    `);

    // Nigeria Apartments
    await db.execute(sql`insert into hotels_master (name, country, city, category, rate, currency, pricing_basis, classification, notes) values
      ('Adedoye - Refundable Caution Deposit', 'Nigeria', 'Lagos', 'Refundable caution deposit', 100000, 'NGN', 'per-trip', 'supplier_cost', 'Record separately as refundable deposit. Not expense unless forfeited'),
      ('Victoria Island 3-bedroom', 'Nigeria', 'Lagos', 'Three-bedroom apartment', 400000, 'NGN', 'per-room-per-night', 'starting_customer_rate', '4-star supplement +50,000 per night'),
      ('Victoria Island 4-star Supplement', 'Nigeria', 'Lagos', 'Four-star option supplement', 50000, 'NGN', 'per-room-per-night', 'supplier_cost', 'Apply once per night if selected'),
      ('Lekki 2-bedroom Option A', 'Nigeria', 'Lagos', 'Two-bedroom apartment', 190000, 'NGN', 'per-room-per-night', 'starting_customer_rate', 'or 200,000 - staff select'),
      ('Lekki 2-bedroom Option B', 'Nigeria', 'Lagos', 'Two-bedroom apartment', 200000, 'NGN', 'per-room-per-night', 'starting_customer_rate', ''),
      ('Lekki 3-star Supplement', 'Nigeria', 'Lagos', 'Three-star option supplement', 25000, 'NGN', 'per-room-per-night', 'supplier_cost', ''),
      ('Large Lekki Apartment 4-bed Base', 'Nigeria', 'Lagos', 'Four-bedroom two-storey base 500k-600k', 500000, 'NGN', 'per-room-per-night', 'starting_customer_rate', 'Staff enter negotiated base within range, supplement 70k for 5-star'),
      ('Large Lekki 5-star Supplement', 'Nigeria', 'Lagos', 'Five-star option supplement', 70000, 'NGN', 'per-room-per-night', 'supplier_cost', ''),
      ('Preston Court Estate 2-room', 'Nigeria', 'Lagos', 'Two-room accommodation', 250000, 'NGN', 'per-room-per-night', 'starting_customer_rate', '4-star supplement 50k'),
      ('Preston Court 4-star Supplement', 'Nigeria', 'Lagos', 'Four-star supplement', 50000, 'NGN', 'per-room-per-night', 'supplier_cost', '')
    `);

    // Activities Benin
    await db.execute(sql`insert into activities_master (name, country, currency, pricing_basis, classification, supplier_cost, selling_price, per_person, fixed_group_price, notes) values
      ('Ganvié Experience Adult', 'Benin', 'FCFA', 'per-person', 'final_fixed_selling_price', 12000, 20000, true, false, 'Includes boat, tour, food. Child 15,000. Infant 1yr FREE. Do not duplicate boat/meal.'),
      ('Ganvié Experience Child', 'Benin', 'FCFA', 'per-person', 'final_fixed_selling_price', 8000, 15000, true, false, 'Child rate'),
      ('Ouidah Tour', 'Benin', 'FCFA', 'per-person', 'final_fixed_selling_price', 4000, 10000, true, false, 'Door of No Return, Python Temple, Sacred Forest etc - select included attractions'),
      ('Cotonou City Tour per-person', 'Benin', 'FCFA', 'per-person', 'final_fixed_selling_price', 2000, 4000, true, false, 'Amazon Statue, Mural Wall, Bio Guerra'),
      ('Cotonou City Tour Fixed Group 5+ pax', 'Benin', 'FCFA', 'per-trip', 'fixed_group_price', 12000, 20000, false, true, 'Fixed 20k for 5+ participants - NEVER multiply by pax'),
      ('Porto-Novo Tour', 'Benin', 'FCFA', 'per-person', 'final_fixed_selling_price', 3000, 5000, true, false, ''),
      ('Porto-Novo King Visit', 'Benin', 'FCFA', 'per-trip', 'final_fixed_selling_price', 50000, 100000, false, false, 'Internal spending 50k, selling 100k'),
      ('Rivière Noire Adjarra', 'Benin', 'FCFA', 'per-person', 'final_fixed_selling_price', 6000, 10000, true, false, ''),
      ('Possotomè', 'Benin', 'FCFA', 'per-person', 'final_fixed_selling_price', 12000, 20000, true, false, ''),
      ('Abomey', 'Benin', 'FCFA', 'per-person', 'starting_customer_rate', null, 70000, true, false, 'Pricing basis unconfirmed - staff confirm per person/group'),
      ('Delta Park', 'Benin', 'FCFA', 'per-person', 'starting_customer_rate', null, 5000, false, false, 'Pricing basis unconfirmed'),
      ('Moon Water Park Adult', 'Benin', 'FCFA', 'per-person', 'final_fixed_selling_price', 2000, 3000, true, false, 'Preserve exact: Adult 3k Child 5k - do not reverse'),
      ('Moon Water Park Child', 'Benin', 'FCFA', 'per-person', 'final_fixed_selling_price', 3000, 5000, true, false, ''),
      ('Agoualand Adult', 'Benin', 'FCFA', 'per-person', 'final_fixed_selling_price', 10000, 15000, true, false, ''),
      ('Agoualand Child', 'Benin', 'FCFA', 'per-person', 'final_fixed_selling_price', 7000, 10000, true, false, ''),
      ('Agoualand Guide', 'Benin', 'FCFA', 'per-trip', 'supplier_cost', 6000, 10000, false, false, 'Charge separately unless marked included'),
      ('Gogotinkpon', 'Benin', 'FCFA', 'per-person', 'final_fixed_selling_price', 10000, 15000, true, false, '')
    `);

    // Togo Activities
    await db.execute(sql`insert into activities_master (name, country, currency, pricing_basis, classification, supplier_cost, selling_price, per_person, fixed_group_price, notes) values
      ('Lomé City Tour', 'Togo', 'FCFA', 'per-person', 'final_fixed_selling_price', 4000, 7000, true, false, ''),
      ('Kpalimé', 'Togo', 'FCFA', 'per-person', 'final_fixed_selling_price', 7000, 10000, true, false, ''),
      ('Togo Guide (negotiated 20k-40k)', 'Togo', 'FCFA', 'per-day', 'starting_customer_rate', 15000, 30000, false, false, 'Staff enter agreed rate 20k-40k, confirm duration')
    `);

    // Nigeria Activities
    await db.execute(sql`insert into activities_master (name, country, currency, pricing_basis, classification, supplier_cost, selling_price, per_person, fixed_group_price, notes) values
      ('Nike Art Gallery', 'Nigeria', 'NGN', 'per-trip', 'fixed_group_price', 20000, 30000, false, true, 'Fixed group selling price - NEVER multiply by pax'),
      ('Lekki Conservation Centre Adult', 'Nigeria', 'NGN', 'per-person', 'final_fixed_selling_price', 8000, 12000, true, false, ''),
      ('Lekki Conservation Centre Child', 'Nigeria', 'NGN', 'per-person', 'final_fixed_selling_price', 6000, 10000, true, false, ''),
      ('Freedom Park', 'Nigeria', 'NGN', 'per-person', 'starting_customer_rate', null, 4000, true, false, 'Currency to be confirmed before activation'),
      ('John Randle', 'Nigeria', 'NGN', 'per-person', 'starting_customer_rate', null, 8000, true, false, 'Currency to be confirmed'),
      ('Apapa Amusement Park', 'Nigeria', 'NGN', 'per-person', 'starting_customer_rate', null, 15000, true, false, 'Currency to be confirmed'),
      ('Landmark Upside Down House', 'Nigeria', 'NGN', 'per-person', 'starting_customer_rate', null, 15000, true, false, 'Currency to be confirmed'),
      ('Nautica Beach Resort', 'Nigeria', 'NGN', 'per-person', 'starting_customer_rate', null, 15000, true, false, 'Currency to be confirmed')
    `);

    // Vehicles
    await db.execute(sql`insert into vehicles_master (name, capacity, currency, rate, pricing_basis, classification, supplier_cost, selling_price, inclusions, notes) values
      ('15-seater - Nigeria to Benin One-way', 15, 'NGN', 500000, 'per-trip', 'final_fixed_selling_price', 400000, 500000, 'One-way pickup/drop-off', 'Latest explicit: cost 400k sell 500k diff 100k. Old 500k ref retained but not duplicated'),
      ('15-seater Return', 15, 'NGN', 1000000, 'per-trip', 'starting_customer_rate', 800000, 1000000, 'Return', 'Original reference'),
      ('30-seater One-way', 30, 'NGN', 800000, 'per-trip', 'starting_customer_rate', null, 800000, 'One-way', 'Confirm cost vs selling classification'),
      ('30-seater Return', 30, 'NGN', 1600000, 'per-trip', 'starting_customer_rate', null, 1600000, 'Return', ''),
      ('Victoria Island Departure Supplement', 15, 'NGN', 50000, 'per-trip', 'final_fixed_selling_price', 30000, 50000, 'Apply only when departure VI and not already included', ''),
      ('Nigeria Local 30-seater Daily', 30, 'NGN', 300000, 'per-day', 'starting_customer_rate', null, 300000, 'Daily local charter', ''),
      ('Nigeria Local 15-seater Daily', 15, 'NGN', 200000, 'per-day', 'starting_customer_rate', null, 200000, 'Daily local charter', ''),
      ('Nigeria Local Sienna Daily', 7, 'NGN', 150000, 'per-day', 'starting_customer_rate', null, 150000, 'Daily local charter', ''),
      ('Airport Drop-off Sienna', 7, 'NGN', 250000, 'per-trip', 'starting_customer_rate', null, 250000, 'Airport drop-off', ''),
      ('Airport Drop-off Car', 4, 'NGN', 180000, 'per-trip', 'starting_customer_rate', null, 180000, 'Airport drop-off', ''),
      ('3-Day Transport Package Sienna', 7, 'NGN', 450000, 'per-trip', 'starting_customer_rate', null, 450000, '3-day package', ''),
      ('3-Day Transport Package Car', 4, 'NGN', 350000, 'per-trip', 'starting_customer_rate', null, 350000, '3-day package', ''),
      ('Combined Package 15-seater inc 2 nights local', 15, 'NGN', 650000, 'per-trip', 'starting_customer_rate', null, 650000, 'Pickup, drop-off, 2 nights local - DO NOT duplicate included transfers', ''),
      ('Benin Toyota Corolla', 4, 'FCFA', 60000, 'per-day', 'starting_customer_rate', null, 60000, 'Driver included? Confirm fuel/tolls/parking/accommodation/permit', 'With driver'),
      ('Benin Toyota Corolla Cross', 4, 'FCFA', 100000, 'per-day', 'starting_customer_rate', null, 100000, '', ''),
      ('Benin Prado 2025', 7, 'FCFA', 150000, 'per-day', 'starting_customer_rate', null, 150000, '', ''),
      ('Benin Prado 2023 White/Brown', 7, 'FCFA', 140000, 'per-day', 'starting_customer_rate', null, 140000, '', ''),
      ('Benin Lexus RX 330', 5, 'FCFA', 90000, 'per-day', 'starting_customer_rate', null, 90000, '', ''),
      ('Benin Toyota Highlander', 5, 'FCFA', 85000, 'per-day', 'starting_customer_rate', null, 85000, '', ''),
      ('Benin Toyota Fortuner', 7, 'FCFA', 150000, 'per-day', 'starting_customer_rate', null, 150000, '', '')
    `);

    // Guides
    await db.execute(sql`insert into guides_master (name, currency, rate, duration, classification, supplier_cost, selling_price, notes) values
      ('Guide Gervais', 'FCFA', 30000, 'full-day', 'starting_customer_rate', null, 30000, 'Confirm duration and classification'),
      ('GOTA Guide Full-day', 'FCFA', 35000, 'full-day', 'final_fixed_selling_price', 20000, 35000, 'Half-day sell 5,000 cost 2,500'),
      ('GOTA Guide Half-day', 'FCFA', 5000, 'half-day', 'final_fixed_selling_price', 2500, 5000, ''),
      ('Both Guides Combined', 'FCFA', 65000, 'full-day', 'starting_customer_rate', 35000, 65000, 'Confirm scope before profit use')
    `);

    // Border
    await db.execute(sql`insert into border_services_master (name, category, currency, rate, pricing_basis, classification, notes) values
      ('ECOWAS Border Protocol', 'ECOWAS', 'FCFA', 10000, 'per-person-per-trip', 'starting_customer_rate', 'Starting rate per person per trip - confirm per trip vs per crossing. Do not auto double for return'),
      ('Non-ECOWAS Border Protocol', 'Non-ECOWAS', 'FCFA', 20000, 'per-person-per-trip', 'starting_customer_rate', 'Same note')
    `);

    // Restaurants
    await db.execute(sql`insert into restaurants_master (name, destination, cuisine, meal_type, cost_per_person, currency, classification, included_type, notes) values
      ('Le Pas Restaurant', 'Ouidah', 'Beninese', 'Lunch', 8000, 'FCFA', 'starting_customer_rate', 'guest_paid', 'Draft exclusion: guest expense unless otherwise included'),
      ('Fidjrossè Sunset Restaurant', 'Cotonou', 'Seafood', 'Dinner', 10000, 'FCFA', 'starting_customer_rate', 'optional_extra', 'Optional sunset experience'),
      ('Mama Benin', 'Cotonou', 'Local', 'Lunch', 7000, 'FCFA', 'starting_customer_rate', 'optional_extra', ''),
      ('Chez Clarisse', 'Cotonou', 'African Fusion', 'Dinner', 9000, 'FCFA', 'starting_customer_rate', 'guest_paid', ''),
      ('Hotel Restaurant - Breakfast Included', 'Cotonou', 'Continental', 'Breakfast', 0, 'FCFA', 'supplier_cost', 'included', 'If hotel breakfast included, do not charge again'),
      ('Street Food Experience', 'Ganvié', 'Local', 'Refreshments', 3000, 'FCFA', 'starting_customer_rate', 'included', 'Part of Ganvié package - do not duplicate')
    `);

    // Settings
    await db.execute(sql`insert into settings (key, value) values
      ('exchangeRate', '2.5'), ('defaultMargin', '10'), ('companyName', 'GOTA Voyages'), ('tagline', 'Expert Through Experience'), ('logoUrl', ''), ('roundingNGN', '1000'), ('paymentTerms', '50% deposit to confirm, balance 7 days before departure'), ('quotationValidity', '7 days'), ('currencyDisplay', 'both')
      on conflict (key) do update set value=excluded.value`);

    // Create demo trip if not exists
    const existing = await db.execute(sql`select id from trips where title='Cotonou Experiential Weekend'`);
    if((existing.rows as any[]).length===0){
      const ins = await db.execute(sql`insert into trips (title, client_name, client_email, client_phone, language, departure_country, destination_country, departure_city, destination_city, start_date, end_date, nights, duration_days, adults, children, infants, status, target_profit, expected_revenue, currency, exchange_rate, notes)
        values ('Cotonou Experiential Weekend', 'Demo Group - 7 Pax', 'demo@gotavoyages.bj', '+229 01 23456789', 'EN', 'Nigeria', 'Benin', 'Lagos', 'Cotonou', '2026-04-10', '2026-04-12', 2, 3, 7, 0, 0, 'draft', 550000, 3115000, 'NGN', 2.5, 'Route: Lagos - Cotonou - Ganvié - Ouidah - Beach - Lagos. 3 Days /2 Nights. Demo illustrative prices: Double 445k pp, Single 545k pp')
        returning id`);
      const tid = (ins.rows as any[])[0].id;
      await db.execute(sql`insert into itinerary_days (trip_id, day_number, date, title, description) values
        (${tid}, 1, '2026-04-10', 'LAGOS TO COTONOU & GANVIÉ EXPERIENCE', '6:00 AM pickup Lagos. Seme border with protocol assistance. Arrival Cotonou & hotel check-in. Ganvié boat tour + cultural experience (boat+meal included). Free evening.'),
        (${tid}, 2, '2026-04-11', 'COTONOU CITY TOUR & OUIDAH CULTURAL EXPERIENCE', '09:00 departure. Cotonou City Tour: Amazon Statue, Mural Wall, Bio Guerra Statue. Ouidah: Door of No Return, Temple of Python, Sacred Forest, Maison du Brésil, Fondation Zinsou. Lunch at Le Pas (guest expense unless included). Optional sunset Fidjrossè.'),
        (${tid}, 3, '2026-04-12', 'COTONOU TO LAGOS', 'Breakfast if applicable. Check-out. Arts & Crafts Market if time permits. Departure for Lagos with border assistance to Lekki.')`);
      await db.execute(sql`insert into trip_services (trip_id, service_name, category, supplier_cost, selling_rate, final_selling_price, quantity, pricing_basis, currency, classification, notes) values
        (${tid}, 'Ganvié Experience Adult', 'activity', 12000, 20000, 20000, 7, 'per-person', 'FCFA', 'final_fixed_selling_price', 'Includes boat+meal - do not add boat/meal again. Cost 12k sell 20k diff 8k'),
        (${tid}, 'Ouidah Tour', 'activity', 4000, 10000, 10000, 7, 'per-person', 'FCFA', 'final_fixed_selling_price', 'Cost 4k sell 10k diff 6k'),
        (${tid}, 'Cotonou City Tour Fixed Group', 'activity', 12000, 20000, 20000, 1, 'per-trip', 'FCFA', 'fixed_group_price', 'Fixed 20k group - never multiply by pax'),
        (${tid}, '15-seater One-way Pickup', 'transport', 400000, 500000, 500000, 1, 'per-trip', 'NGN', 'final_fixed_selling_price', 'Internal cost 400k sell 500k diff 100k one-way'),
        (${tid}, '15-seater One-way Return', 'transport', 400000, 500000, 500000, 1, 'per-trip', 'NGN', 'final_fixed_selling_price', 'Return leg'),
        (${tid}, 'ECOWAS Border Protocol', 'border', 8000, 10000, 10000, 7, 'per-person', 'FCFA', 'final_fixed_selling_price', 'Per person per trip - do not double for return unless scope says so'),
        (${tid}, 'GOTA Guide Full-day', 'guide', 20000, 35000, 35000, 2, 'per-day', 'FCFA', 'final_fixed_selling_price', '2 days'),
        (${tid}, 'Hotel - Benin Royal 2 nights (double: 4 rooms)', 'accommodation', null, null, null, 4, 'per-room-per-night', 'FCFA', 'starting_customer_rate', 'Placeholder - staff select actual hotel/room/nights')
      `);
      await db.execute(sql`insert into trip_accommodations (trip_id, hotel_name, location, room_category, rooms, occupancy_type, guests, check_in, check_out, nights, breakfast_included_qty, meal_plan, supplier_cost, selling_rate, booking_status) values
        (${tid}, 'Benin Royal', 'Cotonou', 'Standard', 4, 'double', 7, '2026-04-10', '2026-04-12', 2, 1, 'bed_and_breakfast', 65000, 75000, 'Pending')`);
      await db.execute(sql`insert into quotations (trip_id, version, title, language, status, total_selling_price, discount, additional_charges, final_amount, currency, inclusions, exclusions, conditions, valid_until) values
        (${tid}, 1, 'Cotonou Experiential Weekend - Double Occupancy (7 pax)', 'EN', 'Draft', 3115000, 0, 0, 3115000, 'NGN', 'Return transport Lagos-Cotonou, Border assistance, 2 nights 3-star hotel, Ganvié boat+meal, Ouidah tour, Cotonou city tour, Guide & coordination', 'Meals not expressly included, Personal expenses, Optional beach activities', '50% deposit to confirm, balance 7 days before departure. Valid 7 days', '2026-04-17')`);
      await db.execute(sql`insert into financial_transactions (trip_id, description, category, amount, currency, type, quantity, expected_cost, expected_revenue, actual_cost, actual_revenue, status, notes) values
        (${tid}, 'Expected Revenue - Double 445k x 7', 'revenue', 3115000, 'NGN', 'revenue', 7, null, 3115000, null, null, 'estimated', 'Illustrative package revenue'),
        (${tid}, 'Target Profit Reserve', 'profit', 550000, 'NGN', 'target_profit', 1, null, null, null, null, 'estimated', 'Target profit for variance demo'),
        (${tid}, 'Hotel Benin Royal 4 rooms x 2 nights', 'accommodation', 520000, 'NGN', 'expense', 8, 520000, null, null, null, 'estimated', '65k FCFA x2.5 = 162.5k NGN per night room -> approx'),
        (${tid}, 'Transport 15-seater return 800k cost', 'transport', 800000, 'NGN', 'expense', 1, 800000, null, null, null, 'estimated', '2 legs cost 400k each'),
        (${tid}, 'Ganvié cost 12k FCFA x7 = 210k NGN', 'activity', 210000, 'NGN', 'expense', 7, 210000, null, null, null, 'estimated', '12k*2.5*7'),
        (${tid}, 'Additional Revenue - Group discount reversal', 'revenue', 250000, 'NGN', 'revenue', 1, null, 250000, null, 250000, 'confirmed', 'Variance demo: actual 800k profit includes this +250k')
      `);
      await db.execute(sql`insert into cash_advances (trip_id, amount, currency, recipient, date, type, status, notes) values (${tid}, 1000000, 'NGN', 'Tour Leader', '2026-04-09', 'advance', 'released', 'Initial cash advance')`);
    }

    // Benin Discovery 6 Days / 5 Nights for 7 people (single rooms) - client sample
    const ben = await db.execute(sql`select id from trips where title='Benin Discovery Tour (6D/5N)'`);
    if((ben.rows as any[]).length===0){
      const ins = await db.execute(sql`insert into trips (title, client_name, client_email, client_phone, language, departure_country, destination_country, departure_city, destination_city, start_date, end_date, nights, duration_days, adults, children, infants, single_occupancy, double_occupancy, status, target_profit, expected_revenue, currency, exchange_rate, meal_plan, notes)
        values ('Benin Discovery Tour (6D/5N)', 'Group of 7 Guests', 'tourisme@gotainternational.com', '+2290196870529', 'EN', 'Nigeria', 'Benin', 'Lagos Mainland', 'Cotonou', '2026-12-01', '2026-12-06', 5, 6, 7, 0, 0, 7, 0, 'confirmed', 1750000, 10500000, 'NGN', 2.5, 'bed_and_breakfast', 'Single rooms for all 7 guests. 3 nights Azalai Hotel Cotonou + 2 nights Casa del Papa. Options: Lagoon 1.5M pp / Sea 1.57M pp.')
        returning id`);
      const bid = (ins.rows as any[])[0].id;
      await db.execute(sql`insert into itinerary_days (trip_id, day_number, date, title, description) values
        (${bid}, 1, '2026-12-01', 'LAGOS MAINLAND TO COTONOU', 'Pick-up from Lagos Mainland. Road transfer to Benin Republic. Border protocol and assistance. Transfer to Cotonou and check-in at Azalai Hotel. Free time to relax.'),
        (${bid}, 2, '2026-12-02', 'OUIDAH HISTORICAL TOUR & COTONOU CITY TOUR', 'Amazon Statue, Longest Mural Wall, Erevan Shopping Centre, local markets, Bio Guerra Monument. Ouidah: Temple of Pythons, Sacred Forest, Slave Route, Door of No Return, Fondation Zinsou. Return to Azalai.'),
        (${bid}, 3, '2026-12-03', 'GANVIÉ BOAT EXCURSION & BEACH', 'Breakfast at hotel. Boat excursion to Ganvié stilt village on Lake Nokoué. Local community. Lunch included during excursion. Beach experience. Return to Azalai.'),
        (${bid}, 4, '2026-12-04', 'FREE / RELAXATION DAY', 'Breakfast, check-out Azalai. Free time for relaxation, shopping or personal activities. Transfer to Casa del Papa and check-in.'),
        (${bid}, 5, '2026-12-05', 'PORTO-NOVO CULTURAL TOUR', 'Breakfast. Musée Honmé, Royal Palace, Porto-Novo cultural landmarks, Songhaï Centre. Overnight at Casa del Papa.'),
        (${bid}, 6, '2026-12-06', 'RETURN TO LAGOS MAINLAND', 'Breakfast and check-out. Return transfer to Lagos Mainland. Border protocol and assistance. Drop-off.')`);
      await db.execute(sql`insert into trip_accommodations (trip_id, hotel_name, location, room_category, rooms, occupancy_type, guests, check_in, check_out, nights, breakfast_included_qty, meal_plan, supplier_cost, selling_rate, booking_status) values
        (${bid}, 'Azalai Hotel Cotonou', 'Cotonou', 'Comfort / Superior Single', 7, 'single', 7, '2026-12-01', '2026-12-04', 3, 1, 'bed_and_breakfast', 70000, 115000, 'Requested'),
        (${bid}, 'Casa del Papa', 'Ouidah', 'Privilège Single Lagoon/Sea', 7, 'single', 7, '2026-12-04', '2026-12-06', 2, 1, 'bed_and_breakfast', 104000, 157500, 'Requested')`);
      await db.execute(sql`insert into trip_services (trip_id, service_name, category, supplier_cost, selling_rate, final_selling_price, quantity, pricing_basis, currency, classification, notes) values
        (${bid}, 'Return Transport Lagos↔Cotonou (15-seater)', 'transport', 800000, 1000000, 1000000, 2, 'per-vehicle', 'NGN', 'final_fixed_selling_price', '15-seater one-way cost 400k, sell 500k per direction'),
        (${bid}, 'Border Protocol ECOWAS return', 'border', 20000, 25000, 25000, 14, 'per-person-per-crossing', 'FCFA', 'final_fixed_selling_price', '2 crossings x 7 pax'),
        (${bid}, 'Ganvié Excursion incl lunch', 'activity', 12000, 20000, 20000, 7, 'per-person', 'FCFA', 'final_fixed_selling_price', 'Boat + lunch included - no double charges'),
        (${bid}, 'Ouidah Historical Tour', 'activity', 4000, 10000, 10000, 7, 'per-person', 'FCFA', 'final_fixed_selling_price', ''),
        (${bid}, 'Cotonou City Tour Fixed Group', 'activity', 60000, 100000, 100000, 1, 'per-trip', 'NGN', 'fixed_group_price', ''),
        (${bid}, 'Porto-Novo Tour', 'activity', 3000, 5000, 5000, 7, 'per-person', 'FCFA', 'final_fixed_selling_price', ''),
        (${bid}, 'Tour Guide (5 days)', 'guide', 150000, 250000, 250000, 5, 'per-day', 'NGN', 'final_fixed_selling_price', ''),
        (${bid}, 'Beach Experience', 'activity', 0, 15000, 15000, 7, 'per-person', 'FCFA', 'final_fixed_selling_price', 'Day 3')`);
      await db.execute(sql`insert into quotations (trip_id, version, title, language, status, total_selling_price, discount, additional_charges, final_amount, currency, inclusions, exclusions, conditions, valid_until) values
        (${bid}, 1, 'Benin Discovery 6D/5N - Option A Casa del Papa Lagoon (7 pax single)', 'EN', 'Ready for Review', 10500000, 0, 0, 10500000, 'NGN', 'Return transport Lagos Mainland↔Cotonou, Border assistance both crossings, 5 nights single rooms (3 Azalai + 2 Casa del Papa Lagoon), Cotonou city tour, Ouidah historical tour, Ganvié boat excursion with lunch, Porto-Novo cultural tour, Tour guide, Breakfasts at hotels, Listed transfers and activities', 'Meals not expressly included, personal expenses, optional activities, travel insurance, gratuities', 'Prices in Naira (₦) using exchange rate 1,000 FCFA = ₦2,500. Subject to hotel availability and FX changes at booking. 50% deposit required to secure rooms. Balance per agreed schedule. All travellers need valid documents. Quotation valid 7 days.', '2026-12-31'),
        (${bid}, 2, 'Benin Discovery 6D/5N - Option B Casa del Papa Sea View (7 pax single)', 'EN', 'Ready for Review', 10990000, 0, 0, 10990000, 'NGN', 'Return transport, border assistance, 5 nights single (3 Azalai + 2 Casa del Papa Sea View), Cotonou, Ouidah, Ganvié (lunch), Porto-Novo, guide, breakfasts, transfers', 'Meals not listed, personal expenses, optional activities', 'Same terms as Option A', '2026-12-31')`);
    }

    return NextResponse.json({ok:true, seeded:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500})}
}
