import { NextResponse } from "next/server";
import { verifyAdminToken } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET(request) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = verifyAdminToken(token);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    admin: { email: payload.email },
  });
}
