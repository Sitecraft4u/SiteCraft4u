import { NextResponse } from "next/server";
import { verifyAdminToken } from "../../../lib/auth";
import { addVisitor, listVisitors, updateVisitorContact } from "../../../lib/visitorStore";

export const runtime = "nodejs";

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function GET(request) {
  const token = request.cookies.get("admin_token")?.value;
  const payload = token ? verifyAdminToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ visitors: listVisitors() });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const visitor = addVisitor({
      id: `vs_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      page: body.page || "/",
      referrer: body.referrer || "direct",
      userAgent: body.userAgent || request.headers.get("user-agent") || "unknown",
      language: body.language || "unknown",
      platform: body.platform || "unknown",
      timezone: body.timezone || "unknown",
      screen: body.screen || "unknown",
      ip: getClientIp(request),
      email: "",
      phone: "",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, visitor });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { visitorId, email, phone } = body;

    if (!visitorId || !email || !phone) {
      return NextResponse.json(
        { error: "visitorId, email and phone are required." },
        { status: 400 }
      );
    }

    const updated = updateVisitorContact(visitorId, { email, phone });
    if (!updated) {
      return NextResponse.json({ error: "Visitor not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, visitor: updated });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
