"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function VisitorTracker() {
  const [visitorId, setVisitorId] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: "", phone: "" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const existingVisitorId = sessionStorage.getItem("sitecraft_visitor_id");
    if (existingVisitorId) {
      setVisitorId(existingVisitorId);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    apiFetch("/api/visitors/status")
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data?.captured) {
          localStorage.setItem("sitecraft_contact_captured", "1");
          if (data.email) localStorage.setItem("sitecraft_contact_email", data.email);
          if (data.phone) localStorage.setItem("sitecraft_contact_phone", data.phone);
          setShowPrompt(false);
        }
      })
      .catch(() => {});

    const captured = localStorage.getItem("sitecraft_contact_captured");
    if (!captured) {
      const timer = window.setTimeout(() => setShowPrompt(true), 2500);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitContact = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      let currentVisitorId = visitorId;
      if (!currentVisitorId) {
        const createResponse = await apiFetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: "lead-capture",
            referrer: typeof document !== "undefined" ? document.referrer : "direct",
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
            language: typeof navigator !== "undefined" ? navigator.language : "unknown",
            platform: typeof navigator !== "undefined" ? navigator.platform : "unknown",
            timezone:
              typeof Intl !== "undefined"
                ? Intl.DateTimeFormat().resolvedOptions().timeZone
                : "unknown",
            screen:
              typeof window !== "undefined"
                ? `${window.screen.width}x${window.screen.height}`
                : "unknown",
          }),
        });
        const createResult = await createResponse.json();
        if (!createResponse.ok || !createResult?.visitor?.id) return;

        currentVisitorId = createResult.visitor.id;
        sessionStorage.setItem("sitecraft_visitor_id", currentVisitorId);
        setVisitorId(currentVisitorId);
      }

      const response = await apiFetch("/api/visitors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: currentVisitorId,
          email: formData.email,
          phone: formData.phone,
        }),
      });
      if (!response.ok) return;

      localStorage.setItem("sitecraft_contact_captured", "1");
      localStorage.setItem("sitecraft_contact_email", formData.email);
      localStorage.setItem("sitecraft_contact_phone", formData.phone);
      setShowPrompt(false);
    } finally {
      setSubmitting(false);
    }
  };

  const skipPrompt = () => {
    localStorage.setItem("sitecraft_contact_captured", "1");
    setShowPrompt(false);
  };

  return showPrompt ? (
    <div className="visitor-prompt">
      <form className="visitor-prompt-card" onSubmit={submitContact}>
        <h3>Stay Connected</h3>
        <p>Share your email and phone so we can send your custom quote details.</p>
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={onChange}
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone number"
          value={formData.phone}
          onChange={onChange}
          required
        />
        <div className="visitor-prompt-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Submit"}
          </button>
          <button
            className="btn btn-outline"
            type="button"
            onClick={skipPrompt}
            disabled={submitting}
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  ) : null;
}
