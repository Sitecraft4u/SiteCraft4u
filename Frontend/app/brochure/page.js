"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { apiFetch } from "../../lib/api";

const offerings = [
  {
    title: "Static Websites",
    details: [
      "Fast-loading, responsive designs",
      "Business portfolio websites",
      "Landing pages",
      "SEO-friendly structure",
    ],
  },
  {
    title: "Dynamic Websites",
    details: [
      "Admin dashboards",
      "Database integration",
      "Secure authentication",
      "API integrations",
    ],
  },
  {
    title: "E-Commerce Development",
    details: [
      "Custom online stores",
      "Payment gateway integration",
      "Inventory management",
      "Order tracking systems",
    ],
  },
  {
    title: "Web Applications",
    details: [
      "Custom business solutions",
      "SaaS platforms",
      "CRM & ERP systems",
      "AI Chatbot integration",
    ],
  },
  {
    title: "Digital Growth Solutions",
    details: [
      "Search Engine Optimization (SEO)",
      "Google Ads Campaign Setup",
      "Organic Social Media Promotion",
      "Performance Optimization",
    ],
  },
];

const emptyForm = {
  packageName: offerings[0].title,
  name: "",
  email: "",
  phone: "",
  requirements: "",
};

export default function BrochurePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [contactInfo, setContactInfo] = useState({ email: "", phone: "" });
  const [leadForm, setLeadForm] = useState({ email: "", phone: "" });
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [showToast, setShowToast] = useState(false);
  const [toastMode, setToastMode] = useState("inline");
  const [quickQuoteOpen, setQuickQuoteOpen] = useState(false);
  const [quickQuoteService, setQuickQuoteService] = useState("");
  const [quickRequirements, setQuickRequirements] = useState("");
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickError, setQuickError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasAccess = localStorage.getItem("sitecraft_brochure_unlocked") === "1";
    const storedEmail = localStorage.getItem("sitecraft_contact_email") || "";
    const storedPhone = localStorage.getItem("sitecraft_contact_phone") || "";
    if (storedEmail && storedPhone) {
      setContactInfo({ email: storedEmail, phone: storedPhone });
    }
    if (hasAccess) {
      setUnlocked(true);
    }

    apiFetch("/api/visitors/status")
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data?.captured) {
          if (data.email) localStorage.setItem("sitecraft_contact_email", data.email);
          if (data.phone) localStorage.setItem("sitecraft_contact_phone", data.phone);
          setContactInfo({ email: data.email || "", phone: data.phone || "" });
          localStorage.setItem("sitecraft_brochure_unlocked", "1");
          localStorage.setItem("sitecraft_contact_captured", "1");
          setUnlocked(true);
        }
      })
      .catch(() => {});
  }, []);

  const selectedPackage = useMemo(
    () => offerings.find((pkg) => pkg.title === formData.packageName),
    [formData.packageName]
  );

  const setPackage = (pkg, shouldScroll = true) => {
    setFormData((prev) => ({
      ...prev,
      packageName: pkg.title,
    }));
    setStatus({ type: "", message: "" });
    if (shouldScroll) {
      const formEl = document.getElementById("quote-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await apiFetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to submit quote request.");
      }

      setStatus({
        type: "success",
        message:
          "Quote submitted successfully. We will get back to you within 24 hours.",
      });
      setToastMode("inline");
      setShowToast(true);
      setFormData((prev) => ({
        ...prev,
        name: "",
        email: "",
        phone: "",
        requirements: "",
      }));
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong while submitting.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const submitQuickQuote = async (event) => {
    event.preventDefault();
    if (!quickRequirements.trim()) {
      setQuickError("Please enter your required description.");
      return;
    }

    setQuickSubmitting(true);
    setQuickError("");
    setStatus({ type: "", message: "" });

    const email =
      contactInfo.email || (typeof window !== "undefined"
        ? localStorage.getItem("sitecraft_contact_email") || ""
        : "");
    const phone =
      contactInfo.phone || (typeof window !== "undefined"
        ? localStorage.getItem("sitecraft_contact_phone") || ""
        : "");

    if (!email || !phone) {
      setQuickSubmitting(false);
      setQuickError("Contact details missing. Please refresh and try again.");
      return;
    }

    try {
      const response = await apiFetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: quickQuoteService,
          name: "Brochure Visitor",
          email,
          phone,
          requirements: quickRequirements.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to submit quick quote request.");
      }
      setStatus({
        type: "success",
        message:
          "Quote submitted successfully. We will get back to you within 24 hours.",
      });
      setToastMode("global");
      setShowToast(true);
      setQuickQuoteOpen(false);
      setQuickQuoteService("");
      setQuickRequirements("");
    } catch (error) {
      setQuickError(error.message || "Something went wrong while submitting.");
    } finally {
      setQuickSubmitting(false);
    }
  };

  const onGetQuote = (item) => {
    setStatus({ type: "", message: "" });
    setPackage(item, false);
    setQuickQuoteService(item.title);
    setQuickRequirements("");
    setQuickError("");
    setQuickQuoteOpen(true);
  };

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => {
      setShowToast(false);
      setStatus({ type: "", message: "" });
      setToastMode("inline");
    }, 2000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const unlockBrochure = async (event) => {
    event.preventDefault();
    setUnlocking(true);
    setUnlockError("");

    try {
      let visitorId =
        typeof window !== "undefined"
          ? sessionStorage.getItem("sitecraft_visitor_id")
          : null;

      if (!visitorId) {
        const createResponse = await apiFetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: "/brochure",
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
        if (!createResponse.ok || !createResult?.visitor?.id) {
          throw new Error("Unable to capture visitor record.");
        }
        visitorId = createResult.visitor.id;
        sessionStorage.setItem("sitecraft_visitor_id", visitorId);
      }

      const updateResponse = await apiFetch("/api/visitors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          email: leadForm.email,
          phone: leadForm.phone,
        }),
      });
      const updateResult = await updateResponse.json();
      if (!updateResponse.ok) {
        throw new Error(updateResult.error || "Unable to unlock brochure.");
      }

      localStorage.setItem("sitecraft_brochure_unlocked", "1");
      localStorage.setItem("sitecraft_contact_captured", "1");
      localStorage.setItem("sitecraft_contact_email", leadForm.email);
      localStorage.setItem("sitecraft_contact_phone", leadForm.phone);
      setContactInfo({ email: leadForm.email, phone: leadForm.phone });
      setUnlocked(true);
    } catch (error) {
      setUnlockError(error.message || "Something went wrong. Please try again.");
    } finally {
      setUnlocking(false);
    }
  };

  if (!unlocked) {
    return (
      <section className="container page-block auth-wrap">
        <article className="panel-card auth-card">
          <p className="eyebrow">Brochure Access</p>
          <h1>Enter Email and Phone to View Brochure</h1>
          <p className="lead-copy">
            Please share your contact details to continue and view the package brochure.
          </p>
          <form className="contact-form" onSubmit={unlockBrochure}>
            <label htmlFor="lead-email">Email Address</label>
            <input
              id="lead-email"
              type="email"
              value={leadForm.email}
              onChange={(event) =>
                setLeadForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />

            <label htmlFor="lead-phone">Phone Number</label>
            <input
              id="lead-phone"
              type="tel"
              value={leadForm.phone}
              onChange={(event) =>
                setLeadForm((prev) => ({ ...prev, phone: event.target.value }))
              }
              required
            />

            <button className="btn btn-primary" type="submit" disabled={unlocking}>
              {unlocking ? "Checking..." : "View Brochure"}
            </button>

            {unlockError ? <p className="form-status error">{unlockError}</p> : null}
          </form>
        </article>
      </section>
    );
  }

  return (
    <section className="container page-block">
      <p className="eyebrow">Brochure</p>
      <h1>Our Services Brochure</h1>
      <p className="lead-copy">
        Click any service to request a quote. If you already shared email and phone,
        it submits instantly.
      </p>

      <div className="grid-3">
        {offerings.map((item) => (
          <article
            className={`price-card ${
              formData.packageName === item.title ? "price-card-active" : ""
            }`}
            key={item.title}
          >
            <h3>{item.title}</h3>
            <ul className="clean-list">
              {item.details.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <button className="btn btn-primary quote-btn" onClick={() => onGetQuote(item)}>
              Get Quote
            </button>
          </article>
        ))}
      </div>

      <article id="quote-form" className="panel-card quote-form-card">
        <h2>Request a Quote</h2>
        <p className="lead-copy">
          Selected: <strong>{selectedPackage?.title || formData.packageName}</strong>
        </p>
        <form className="contact-form" onSubmit={onSubmit}>
          <label htmlFor="packageName">Package</label>
          <select
            id="packageName"
            name="packageName"
            value={formData.packageName}
            onChange={(event) => {
              const pkg = offerings.find((item) => item.title === event.target.value);
              if (!pkg) return;
              setFormData((prev) => ({
                ...prev,
                packageName: pkg.title,
              }));
            }}
            required
          >
            {offerings.map((item) => (
              <option key={item.title} value={item.title}>
                {item.title}
              </option>
            ))}
          </select>

          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={onChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            required
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            required
          />

          <label htmlFor="requirements">Project Requirements</label>
          <textarea
            id="requirements"
            name="requirements"
            rows="5"
            value={formData.requirements}
            onChange={onChange}
            required
          />

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Quote Request"}
          </button>

          {showToast && status.type === "success" && toastMode === "inline" ? (
            <div className="quote-toast" role="status" aria-live="polite">
              <span className="quote-success-tick" aria-hidden="true" />
              <p>{status.message}</p>
            </div>
          ) : null}

          {status.type === "error" ? (
            <p className={`form-status ${status.type}`}>{status.message}</p>
          ) : null}
        </form>
      </article>

      {showToast && status.type === "success" && toastMode === "global"
        ? createPortal(
            <div className="quote-toast-global" role="status" aria-live="polite">
              <span className="quote-success-tick" aria-hidden="true" />
              <p>{status.message}</p>
            </div>,
            document.body
          )
        : null}

      {mounted && quickQuoteOpen
        ? createPortal(
            <div className="quick-quote-modal" role="dialog" aria-modal="true">
              <form className="quick-quote-card" onSubmit={submitQuickQuote}>
                <h3>Quote for {quickQuoteService}</h3>
                <p>Please provide your required description before submitting.</p>
                <label htmlFor="quick-requirements">Required Description</label>
                <textarea
                  id="quick-requirements"
                  rows="5"
                  value={quickRequirements}
                  onChange={(event) => setQuickRequirements(event.target.value)}
                  required
                />
                {quickError ? <p className="form-status error">{quickError}</p> : null}
                <div className="quick-quote-actions">
                  <button className="btn btn-primary" type="submit" disabled={quickSubmitting}>
                    {quickSubmitting ? "Submitting..." : "Submit Quote"}
                  </button>
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => setQuickQuoteOpen(false)}
                    disabled={quickSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>,
            document.body
          )
        : null}
    </section>
  );
}
