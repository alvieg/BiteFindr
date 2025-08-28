import { db } from "$lib/db";
import { json } from "@sveltejs/kit";

export async function GET() {
  const [rows] = await db.query("SELECT DATABASE() as db");
  return json({ connectedTo: rows[0].db });
}
