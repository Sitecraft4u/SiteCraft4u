import { NextResponse } from "next/server";
import { verifyAdminToken } from "../../../lib/auth";
import { addFeedback, listFeedback } from "../../../lib/contactStore";

export const runtime = "nodejs";

export async function GET(request) {
  const token = request.cookies.get("admin_token")?.value;
  const payload = token ? verifyAdminToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ feedback: listFeedback() });
}

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Name, email, phone, and message are required." },
        { status: 400 }
      );
    }

    const feedback = addFeedback({
      id: `fb_${Date.now()}`,
      name,
      email,
      phone,
      message,
      createdAt: new Date().toISOString(),
    });

    console.log("Contact form submission:", {
      ...feedback,
      submittedAt: feedback.createdAt,
    });

    return NextResponse.json({
      success: true,
      message: "Message received.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
