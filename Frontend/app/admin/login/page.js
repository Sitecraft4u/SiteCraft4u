"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await apiFetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to login.");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container page-block auth-wrap">
      <article className="panel-card auth-card">
        <p className="eyebrow">Admin Login</p>
        <h1>Sign in to Admin Panel</h1>
        <p className="lead-copy">
          Use your admin credentials to access quote submissions.
        </p>
        <form className="contact-form" onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
          {error ? <p className="form-status error">{error}</p> : null}
        </form>
      </article>
    </section>
  );
}
