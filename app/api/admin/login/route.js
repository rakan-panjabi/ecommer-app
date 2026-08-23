import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();

  const validEmail = process.env.ADMIN_EMAIL || "rakanfabric@gmail.com";
  const validPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (email === validEmail && password === validPassword) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return res;
  }

  return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("admin_session");
  return res;
}
