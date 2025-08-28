import { db } from "$lib/db";
import bcrypt from "bcrypt";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    return json({ success: true });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return json({ error: "Username or email already exists" }, { status: 400 });
    }
    return json({ error: "Database error" }, { status: 500 });
  }
}
