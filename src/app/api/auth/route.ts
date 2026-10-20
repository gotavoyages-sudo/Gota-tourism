import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken, SESSION_COOKIE, DEFAULT_LOGIN } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ authenticated: false });
  const payload = verifySessionToken(token);
  if (!payload) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, user: payload });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const action = body.action;

  if (action === "login") {
    const email = String(body.email || "").trim();
    const password = String(body.password || "").trim();
    try {
      const existing = await db.execute(sql`select * from users limit 1`);
      let user: any = (existing.rows as any[])[0];
      if (!user) {
        const h = hashPassword(DEFAULT_LOGIN.password);
        await db.execute(sql`insert into users (email, password_hash, name, role) values (${DEFAULT_LOGIN.email}, ${h}, ${DEFAULT_LOGIN.name}, ${DEFAULT_LOGIN.role})`);
        const r2 = await db.execute(sql`select * from users limit 1`);
        user = (r2.rows as any[])[0];
      }
      // enforce single login: case-insensitive email + trimmed
      if (user.email.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json({ error: `Invalid email. Active login is ${user.email}` }, { status: 401 });
      }
      if (!verifyPassword(password, user.password_hash)) {
        return NextResponse.json({ error: "Invalid password. Tip: default is Gota2026! (capital G, no spaces). Use Reset button if needed." }, { status: 401 });
      }
      const token = createSessionToken({ email: user.email, name: user.name, role: user.role });
      const res = NextResponse.json({ ok: true, user: { email: user.email, name: user.name, role: user.role } });
      res.cookies.set(SESSION_COOKIE, token, {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete(SESSION_COOKIE);
    res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  // RESET TO DEFAULT - no auth required (single-login recovery for demo/internal)
  // This ensures you can always recover if password is lost
  if (action === "reset_default") {
    try {
      const h = hashPassword(DEFAULT_LOGIN.password);
      const existing = await db.execute(sql`select * from users limit 1`);
      if ((existing.rows as any[]).length === 0) {
        await db.execute(sql`insert into users (email, password_hash, name, role) values (${DEFAULT_LOGIN.email}, ${h}, ${DEFAULT_LOGIN.name}, ${DEFAULT_LOGIN.role})`);
      } else {
        await db.execute(sql`update users set email=${DEFAULT_LOGIN.email}, password_hash=${h}, name=${DEFAULT_LOGIN.name}, role=${DEFAULT_LOGIN.role} where id=(select min(id) from users)`);
        await db.execute(sql`delete from users where id not in (select min(id) from users)`);
      }
      return NextResponse.json({ ok: true, resetTo: DEFAULT_LOGIN.email, message: `Reset successful. Login with ${DEFAULT_LOGIN.email} / ${DEFAULT_LOGIN.password}` });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  if (action === "update") {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token || !verifySessionToken(token)) {
      return NextResponse.json({ error: "Not authenticated. Please log in first." }, { status: 401 });
    }
    const { email, name, password, currentPassword } = body;
    try {
      const existing = await db.execute(sql`select * from users limit 1`);
      const user: any = (existing.rows as any[])[0];
      if (!user) return NextResponse.json({ error: "No user found" }, { status: 404 });
      if (password) {
        if (!currentPassword || !verifyPassword(String(currentPassword).trim(), user.password_hash)) {
          return NextResponse.json({ error: "Current password incorrect. If you lost it, use the Reset to Default button on the login page." }, { status: 401 });
        }
      }
      const newHash = password ? hashPassword(String(password).trim()) : user.password_hash;
      const newEmail = String(email || user.email).trim();
      const newName = String(name || user.name).trim();
      await db.execute(sql`update users set email=${newEmail}, name=${newName}, password_hash=${newHash} where id=${user.id}`);
      const newToken = createSessionToken({ email: newEmail, name: newName, role: user.role });
      const res = NextResponse.json({ ok: true });
      res.cookies.set(SESSION_COOKIE, newToken, { httpOnly: false, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
      return res;
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
