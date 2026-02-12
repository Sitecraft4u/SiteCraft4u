"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const contactDetails = {
  phoneDisplay: "+91 8016006068",
  phoneLink: "+918016006068",
  email: "helpdesk@sitecraft4u.com",
  address: "2M4F+M5M, 238, 5th A Cross Rd, Rajarajeshwari Layout, Dooravani Nagar, Bengaluru, Karnataka 560016",
  mapEmbedUrl: "https://maps.google.com/maps?q=2M4F%2BM5M%2C%20238%2C%205th%20A%20Cross%20Rd%2C%20Rajarajeshwari%20Layout%2C%20Dooravani%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560016&output=embed",
  mapLink: "https://maps.app.goo.gl/RUswzpgJdfj9XNwZ7",
};

export default function ContactPage() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [showToast, setShowToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to submit form");
      }

      setStatus({
        type: "success",
        message:
          "Project inquiry submitted successfully. We will get back to you within 24 hours.",
      });
      setShowToast(true);
      setFormData(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => {
      setShowToast(false);
      setStatus({ type: "", message: "" });
    }, 2000);
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <section className="container page-block">
      <p className="eyebrow">Contact Us</p>
      <h1>Tell us what you need, we will map the solution</h1>
      <p className="lead-copy">
        Share your scope, timeline, and goals. We will respond with a practical plan.
      </p>

      <div className="contact-grid">
        <article className="panel-card contact-form-card">
          <h2>Project Inquiry</h2>
          <form className="contact-form" onSubmit={onSubmit}>
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

            <label htmlFor="message">Project Details</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={formData.message}
              onChange={onChange}
              required
            />

            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </button>

            {showToast && status.type === "success" ? (
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

        <article className="panel-card">
          <h2>Contact Information</h2>
          <div className="contact-meta">
            <p>
              <strong>Phone:</strong>{" "}
              <a href={`tel:${contactDetails.phoneLink}`}>{contactDetails.phoneDisplay}</a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
            </p>
            <p>
              <strong>Location:</strong> <a href={contactDetails.mapLink} target="_blank" rel="noreferrer">Open on Google Maps</a>
            </p>
          </div>
          <div className="map-wrap" aria-label="Google map location">
            <iframe
              title="Sitecraft4u Location"
              src={contactDetails.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <h2 className="why-title">Why teams contact us</h2>
          <ul className="clean-list">
            <li>Improve website quality and business credibility</li>
            <li>Get more qualified leads and customer inquiries</li>
            <li>Build a stronger online presence for long-term growth</li>
            <li>Receive ongoing support and performance improvements</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
