import { db } from "$lib/db";
import bcrypt from "bcrypt";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
  const { email, password } = await request.json();

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length === 0) {
    return json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    return json({ error: "Invalid credentials" }, { status: 401 });
  }

  return json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
}
