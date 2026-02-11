import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { signAdminToken, validateAdminCredentials, verifyAdminToken } from "./auth.js";
import { feedbackStore, quotesStore, visitorsStore } from "./stores.js";

const app = express();
const PORT = Number(process.env.PORT || 4000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || "lax";

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const allowList = FRONTEND_ORIGIN.split(",").map((v) => v.trim());
      if (allowList.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed"), false);
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.headers["x-real-ip"] || req.headers["cf-connecting-ip"] || "unknown";
}

function requireAdmin(req, res, next) {
  const token = req.cookies?.admin_token;
  const payload = token ? verifyAdminToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.admin = payload;
  next();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  if (!validateAdminCredentials(email, password)) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = signAdminToken({ email, role: "admin" });
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: COOKIE_SAME_SITE,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.json({ success: true });
});

app.post("/api/admin/logout", (_req, res) => {
  res.cookie("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: COOKIE_SAME_SITE,
    path: "/",
    maxAge: 0,
  });
  res.json({ success: true });
});

app.get("/api/admin/session", requireAdmin, (req, res) => {
  res.json({
    authenticated: true,
    admin: { email: req.admin.email },
  });
});

app.get("/api/quotes", requireAdmin, (_req, res) => {
  res.json({ quotes: quotesStore.list() });
});

app.post("/api/quotes", (req, res) => {
  const { packageName, packagePrice, name, email, phone, requirements } = req.body || {};
  if (!packageName || !email || !phone) {
    return res.status(400).json({ error: "Package, email, and phone are required." });
  }
  const quote = quotesStore.add({
    id: `qt_${Date.now()}`,
    packageName,
    packagePrice: packagePrice || "",
    name: name || "Brochure Visitor",
    email,
    phone,
    requirements: requirements || "Quick quote request from brochure card.",
    createdAt: new Date().toISOString(),
  });
  res.json({ success: true, quote });
});

app.get("/api/visitors", requireAdmin, (_req, res) => {
  res.json({ visitors: visitorsStore.list() });
});

app.post("/api/visitors", (req, res) => {
  const body = req.body || {};
  const visitor = visitorsStore.add({
    id: `vs_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    page: body.page || "/",
    referrer: body.referrer || "direct",
    userAgent: body.userAgent || req.headers["user-agent"] || "unknown",
    language: body.language || "unknown",
    platform: body.platform || "unknown",
    timezone: body.timezone || "unknown",
    screen: body.screen || "unknown",
    ip: getClientIp(req),
    email: "",
    phone: "",
    createdAt: new Date().toISOString(),
  });
  res.json({ success: true, visitor });
});

app.patch("/api/visitors", (req, res) => {
  const { visitorId, email, phone } = req.body || {};
  if (!visitorId || !email || !phone) {
    return res.status(400).json({ error: "visitorId, email and phone are required." });
  }
  const updated = visitorsStore.updateContact(visitorId, { email, phone });
  if (!updated) {
    return res.status(404).json({ error: "Visitor not found." });
  }
  return res.json({ success: true, visitor: updated });
});

app.get("/api/visitors/status", (req, res) => {
  const ip = getClientIp(req);
  const contact = visitorsStore.getCapturedByIp(ip);
  res.json({
    captured: visitorsStore.hasCapturedByIp(ip),
    email: contact?.email || "",
    phone: contact?.phone || "",
  });
});

app.get("/api/contact", requireAdmin, (_req, res) => {
  res.json({ feedback: feedbackStore.list() });
});

app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body || {};
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "Name, email, phone, and message are required." });
  }
  const feedback = feedbackStore.add({
    id: `fb_${Date.now()}`,
    name,
    email,
    phone,
    message,
    createdAt: new Date().toISOString(),
  });
  console.log("Contact form submission:", feedback);
  res.json({ success: true, message: "Message received." });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
