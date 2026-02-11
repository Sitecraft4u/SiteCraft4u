import { NextResponse } from "next/server";
import {
  getCapturedContactByIp,
  hasCapturedContactByIp,
} from "../../../../lib/visitorStore";

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
  const ip = getClientIp(request);
  const contact = getCapturedContactByIp(ip);
  return NextResponse.json({
    captured: hasCapturedContactByIp(ip),
    email: contact?.email || "",
    phone: contact?.phone || "",
  });
}
