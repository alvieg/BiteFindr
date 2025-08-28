import { db } from "$lib/db";
import { json } from "@sveltejs/kit";

// GET: fetch user favorites (requires user_id in query)
export async function GET({ url }) {
  const userId = url.searchParams.get("user_id");
  if (!userId) return json({ error: "Missing user_id" }, { status: 400 });

  const [rows] = await db.query("SELECT * FROM favorites WHERE user_id = ?", [userId]);
  return json(rows);
}

// POST: add favorite
export async function POST({ request }) {
  const { user_id, external_recipe_id, title } = await request.json();
  if (!user_id || !external_recipe_id) return json({ error: "Missing fields" }, { status: 400 });

  try {
    await db.query(
      "INSERT INTO favorites (user_id, external_recipe_id, title) VALUES (?, ?, ?)",
      [user_id, external_recipe_id, title || null]
    );
    return json({ success: true });
  } catch (err) {
    console.error(err);
    return json({ error: "Database error" }, { status: 500 });
  }
}

// DELETE: remove favorite
export async function DELETE({ request }) {
  const { id } = await request.json();
  if (!id) return json({ error: "Missing favorite id" }, { status: 400 });

  try {
    await db.query("DELETE FROM favorites WHERE id = ?", [id]);
    return json({ success: true });
  } catch (err) {
    console.error(err);
    return json({ error: "Database error" }, { status: 500 });
  }
}
