import { NextResponse } from "next/server";
import { verifyAdminToken } from "../../../lib/auth";
import { addQuote, listQuotes } from "../../../lib/quoteStore";

export const runtime = "nodejs";

export async function GET(request) {
  const token = request.cookies.get("admin_token")?.value;
  const payload = token ? verifyAdminToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ quotes: listQuotes() });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { packageName, packagePrice, name, email, phone, requirements } = body;

    if (!packageName || !email || !phone) {
      return NextResponse.json(
        { error: "Package, email, and phone are required." },
        { status: 400 }
      );
    }

    const quote = addQuote({
      id: `qt_${Date.now()}`,
      packageName,
      packagePrice: packagePrice || "",
      name: name || "Brochure Visitor",
      email,
      phone,
      requirements: requirements || "Quick quote request from brochure card.",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, quote });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
