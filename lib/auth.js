import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_jwt_secret";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@sitecraft4u.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

export function validateAdminCredentials(email, password) {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function signAdminToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
