"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/api";

const PENDING_KEY = "sitecraft_admin_auto_logout_pending";

function percentage(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function serviceDistribution(quotes) {
  const map = new Map();
  quotes.forEach((q) => {
    map.set(q.packageName, (map.get(q.packageName) || 0) + 1);
  });
  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

export default function AdminQuotesPanel() {
  const router = useRouter();
  const manualLogoutRef = useRef(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const sessionResponse = await apiFetch("/api/admin/session", { cache: "no-store" });
      const sessionResult = await sessionResponse.json();
      if (!sessionResponse.ok || !sessionResult?.authenticated) {
        router.push("/admin/login");
        router.refresh();
        return;
      }
      setAdminEmail(sessionResult.admin?.email || "");

      const [quotesResponse, visitorsResponse, feedbackResponse] = await Promise.all([
        apiFetch("/api/quotes", { cache: "no-store" }),
        apiFetch("/api/visitors", { cache: "no-store" }),
        apiFetch("/api/contact", { cache: "no-store" }),
      ]);

      const quotesResult = await quotesResponse.json();
      const visitorsResult = await visitorsResponse.json();
      const feedbackResult = await feedbackResponse.json();

      if (!quotesResponse.ok) {
        throw new Error(quotesResult.error || "Unable to load quotes.");
      }
      if (!visitorsResponse.ok) {
        throw new Error(visitorsResult.error || "Unable to load visitors.");
      }
      if (!feedbackResponse.ok) {
        throw new Error(feedbackResult.error || "Unable to load feedback.");
      }

      setQuotes(quotesResult.quotes || []);
      setVisitors(visitorsResult.visitors || []);
      setFeedback(feedbackResult.feedback || []);
    } catch (err) {
      setError(err.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    manualLogoutRef.current = true;
    await apiFetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  useEffect(() => {
    loadData();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(PENDING_KEY);
    }
    return () => {
      if (typeof window === "undefined") return;
      if (manualLogoutRef.current) return;
      sessionStorage.setItem(PENDING_KEY, "1");
    };
  }, []);

  const customers = useMemo(() => {
    const byEmail = new Map();
    quotes.forEach((q) => {
      if (!byEmail.has(q.email)) {
        byEmail.set(q.email, {
          name: q.name,
          email: q.email,
          phone: q.phone,
          totalQuotes: 0,
          lastService: q.packageName,
          lastAt: q.createdAt,
        });
      }
      const row = byEmail.get(q.email);
      row.totalQuotes += 1;
      if (new Date(q.createdAt).getTime() > new Date(row.lastAt).getTime()) {
        row.lastAt = q.createdAt;
        row.lastService = q.packageName;
      }
    });
    return Array.from(byEmail.values());
  }, [quotes]);

  const leads = useMemo(
    () => visitors.filter((v) => v.email && v.phone && !quotes.some((q) => q.email === v.email)),
    [visitors, quotes]
  );

  const report = useMemo(() => {
    const visitorsCount = visitors.length;
    const quotesCount = quotes.length;
    const feedbackCount = feedback.length;
    const leadsCount = leads.length;
    const customersCount = customers.length;
    const conversionRate = percentage(customersCount, visitorsCount);
    const leadCaptureRate = percentage(leadsCount + customersCount, visitorsCount);
    const distribution = serviceDistribution(quotes);
    const maxServiceValue = Math.max(...distribution.map((d) => d.value), 1);

    return {
      visitorsCount,
      quotesCount,
      feedbackCount,
      leadsCount,
      customersCount,
      conversionRate,
      leadCaptureRate,
      distribution,
      maxServiceValue,
    };
  }, [visitors, quotes, feedback, leads, customers]);

  return (
    <section className="container page-block">
      <p className="eyebrow">Admin Dashboard</p>
      <h1>Customers, Leads, Reports & Feedback</h1>
      <p className="lead-copy">Logged in as {adminEmail}</p>

      <div className="admin-actions">
        <button className="btn btn-outline" onClick={loadData} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
        <button className="btn btn-primary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error ? <p className="form-status error">{error}</p> : null}

      <section className="dashboard-kpi-grid">
        <article className="dashboard-kpi-card">
          <p>Visitors</p>
          <h3>{report.visitorsCount}</h3>
        </article>
        <article className="dashboard-kpi-card">
          <p>Leads</p>
          <h3>{report.leadsCount}</h3>
        </article>
        <article className="dashboard-kpi-card">
          <p>Customers</p>
          <h3>{report.customersCount}</h3>
        </article>
        <article className="dashboard-kpi-card">
          <p>Quotes</p>
          <h3>{report.quotesCount}</h3>
        </article>
        <article className="dashboard-kpi-card">
          <p>Feedback</p>
          <h3>{report.feedbackCount}</h3>
        </article>
        <article className="dashboard-kpi-card">
          <p>Conversion Rate</p>
          <h3>{report.conversionRate}%</h3>
        </article>
      </section>

      <section className="dashboard-report-grid">
        <article className="dashboard-chart-card">
          <h2>Service Demand Graph</h2>
          {report.distribution.length === 0 ? (
            <p className="lead-copy">No quote data yet.</p>
          ) : (
            <div className="mini-bar-chart">
              {report.distribution.map((item) => (
                <div className="mini-bar-row" key={item.label}>
                  <p>{item.label}</p>
                  <div className="mini-bar-track">
                    <span
                      className="mini-bar-fill"
                      style={{ width: `${(item.value / report.maxServiceValue) * 100}%` }}
                    />
                  </div>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="dashboard-chart-card">
          <h2>Lead Capture Report</h2>
          <div className="report-meter">
            <p>Lead Capture</p>
            <div className="meter-track">
              <span style={{ width: `${report.leadCaptureRate}%` }} />
            </div>
            <strong>{report.leadCaptureRate}%</strong>
          </div>
          <div className="report-meter">
            <p>Visitor to Customer</p>
            <div className="meter-track">
              <span style={{ width: `${report.conversionRate}%` }} />
            </div>
            <strong>{report.conversionRate}%</strong>
          </div>
        </article>
      </section>

      <h2 className="admin-subtitle">Customers</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Quotes</th>
              <th>Last Service</th>
              <th>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6">No customers yet.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.email}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.totalQuotes}</td>
                  <td>{c.lastService}</td>
                  <td>{new Date(c.lastAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="admin-subtitle">Leads</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Page</th>
              <th>Referrer</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="5">No leads yet.</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{new Date(lead.createdAt).toLocaleString()}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.page}</td>
                  <td>{lead.referrer}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="admin-subtitle">Reports: Quote Requests</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Service</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Requirements</th>
            </tr>
          </thead>
          <tbody>
            {quotes.length === 0 ? (
              <tr>
                <td colSpan="6">No quote requests yet.</td>
              </tr>
            ) : (
              quotes.map((quote) => (
                <tr key={quote.id}>
                  <td>{new Date(quote.createdAt).toLocaleString()}</td>
                  <td>{quote.packageName}</td>
                  <td>{quote.name}</td>
                  <td>{quote.email}</td>
                  <td>{quote.phone}</td>
                  <td>{quote.requirements}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="admin-subtitle">Feedback: Contact Inquiries</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {feedback.length === 0 ? (
              <tr>
                <td colSpan="5">No feedback/inquiries yet.</td>
              </tr>
            ) : (
              feedback.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
