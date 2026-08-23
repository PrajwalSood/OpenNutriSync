import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { timestamp, active_energy_kcal, steps } = await req.json();

    const result = await sql`
      INSERT INTO activity_logs (timestamp, active_energy_kcal, steps)
      VALUES (${timestamp || new Date().toISOString()}, ${active_energy_kcal || 0}, ${steps || 0})
      RETURNING id;
    `;

    return NextResponse.json({ success: true, activity_id: result[0].id }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Activity ingestion error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
