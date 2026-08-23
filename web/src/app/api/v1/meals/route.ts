import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
    return unauthorized();
  }

  try {
    const payload = await req.json();
    const { timestamp, meal_name, energy_hydration, macronutrients, vitamins, minerals } = payload;

    const mealResult = await sql`
      INSERT INTO meals (timestamp, meal_name)
      VALUES (${timestamp || new Date().toISOString()}, ${meal_name || "Uncategorized Meal"})
      RETURNING id;
    `;

    const mealId = mealResult[0].id;

    await sql`
      INSERT INTO meal_nutrients (
        meal_id,
        dietary_energy_kcal, water_ml, caffeine_mg,
        carbohydrates_g, dietary_sugar_g, fiber_g, protein_g, total_fat_g, saturated_fat_g, monounsaturated_fat_g, polyunsaturated_fat_g, cholesterol_mg,
        vitamin_a_mcg, thiamin_b1_mg, riboflavin_b2_mg, niacin_b3_mg, pantothenic_acid_b5_mg, vitamin_b6_mg, biotin_b7_mcg, folate_b9_mcg, cobalamin_b12_mcg, vitamin_c_mg, vitamin_d_iu, vitamin_e_mg, vitamin_k_mcg,
        calcium_mg, chloride_mg, chromium_mcg, copper_mg, iodine_mcg, iron_mg, magnesium_mg, manganese_mg, molybdenum_mcg, phosphorus_mg, potassium_mg, selenium_mcg, sodium_mg, zinc_mg
      ) VALUES (
        ${mealId},
        ${energy_hydration?.dietary_energy_kcal || 0}, ${energy_hydration?.water_ml || 0}, ${energy_hydration?.caffeine_mg || 0},
        ${macronutrients?.carbohydrates_g || 0}, ${macronutrients?.dietary_sugar_g || 0}, ${macronutrients?.fiber_g || 0}, ${macronutrients?.protein_g || 0}, ${macronutrients?.total_fat_g || 0}, ${macronutrients?.saturated_fat_g || 0}, ${macronutrients?.monounsaturated_fat_g || 0}, ${macronutrients?.polyunsaturated_fat_g || 0}, ${macronutrients?.cholesterol_mg || 0},
        ${vitamins?.vitamin_a_mcg || 0}, ${vitamins?.thiamin_b1_mg || 0}, ${vitamins?.riboflavin_b2_mg || 0}, ${vitamins?.niacin_b3_mg || 0}, ${vitamins?.pantothenic_acid_b5_mg || 0}, ${vitamins?.vitamin_b6_mg || 0}, ${vitamins?.biotin_b7_mcg || 0}, ${vitamins?.folate_b9_mcg || 0}, ${vitamins?.cobalamin_b12_mcg || 0}, ${vitamins?.vitamin_c_mg || 0}, ${vitamins?.vitamin_d_iu || 0}, ${vitamins?.vitamin_e_mg || 0}, ${vitamins?.vitamin_k_mcg || 0},
        ${minerals?.calcium_mg || 0}, ${minerals?.chloride_mg || 0}, ${minerals?.chromium_mcg || 0}, ${minerals?.copper_mg || 0}, ${minerals?.iodine_mcg || 0}, ${minerals?.iron_mg || 0}, ${minerals?.magnesium_mg || 0}, ${minerals?.manganese_mg || 0}, ${minerals?.molybdenum_mcg || 0}, ${minerals?.phosphorus_mg || 0}, ${minerals?.potassium_mg || 0}, ${minerals?.selenium_mcg || 0}, ${minerals?.sodium_mg || 0}, ${minerals?.zinc_mg || 0}
      );
    `;

    return NextResponse.json({ success: true, meal_id: mealId }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Meal ingestion error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
    return unauthorized();
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const rows = date
    ? await sql`
        SELECT m.id, m.timestamp, m.meal_name, n.*
        FROM meals m
        JOIN meal_nutrients n ON n.meal_id = m.id
        WHERE m.timestamp::date = ${date}::date
        ORDER BY m.timestamp DESC;
      `
    : await sql`
        SELECT m.id, m.timestamp, m.meal_name, n.*
        FROM meals m
        JOIN meal_nutrients n ON n.meal_id = m.id
        ORDER BY m.timestamp DESC
        LIMIT 50;
      `;

  return NextResponse.json({ meals: rows });
}
