import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: "120+", label: "Projects Delivered" },
  { value: "4.8/5", label: "Average Client Rating" },
  { value: "35%", label: "Avg. Conversion Lift" },
  { value: "72h", label: "First Draft Turnaround" },
];

const services = [
  {
    title: "Static Websites",
    items: [
      "Fast-loading, responsive designs",
      "Business portfolio websites",
      "Landing pages",
      "SEO-friendly structure",
    ],
  },
  {
    title: "Dynamic Websites",
    items: [
      "Admin dashboards",
      "Database integration",
      "Secure authentication",
      "API integrations",
    ],
  },
  {
    title: "E-Commerce Development",
    items: [
      "Custom online stores",
      "Payment gateway integration",
      "Inventory management",
      "Order tracking systems",
    ],
  },
  {
    title: "Web Applications",
    items: [
      "Custom business solutions",
      "SaaS platforms",
      "CRM & ERP systems",
      "AI Chatbot integration",
    ],
  },
  {
    title: "Digital Growth Solutions",
    items: [
      "Search Engine Optimization (SEO)",
      "Google Ads Campaign Setup",
      "Organic Social Media Promotion",
      "Performance Optimization",
    ],
  },
];

const process = [
  { step: "01", title: "Discovery", text: "Business goals, audience, and offer mapping." },
  { step: "02", title: "Design", text: "Wireframes and visual direction aligned to your brand." },
  { step: "03", title: "Develop", text: "Next.js frontend and Node.js API implementation." },
  { step: "04", title: "Launch", text: "Quality checks, deployment, and post-launch tuning." },
];

export default function HomePage() {
  return (
    <>
      <section className="container hero hero-single">
        <div className="hero-copy">
          <Image
            src="/sitecraft4u-logo.svg"
            alt="Sitecraft4u"
            width={260}
            height={78}
            className="hero-logo"
          />
          <p className="eyebrow">Sitecraft4u Digital Studio</p>
          <h1>Build high-performing digital experiences that scale your business</h1>
          <p>
            Reference-inspired layout and messaging style, tailored to your own
            blue-teal brand identity. We combine sharp design with practical engineering.
          </p>
          <div className="cta-row">
            <Link href="/contact" className="btn btn-primary">
              Book a Free Consultation
            </Link>
            <Link href="/brochure" className="btn btn-outline">
              Download Brochure
            </Link>
          </div>
          <div className="trust-line">Trusted by startups, agencies, and local businesses</div>
        </div>
      </section>

      <section className="container stats-row">
        {stats.map((item) => (
          <article key={item.label} className="stat-card">
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </article>
        ))}
      </section>

      <section className="container page-block">
        <p className="eyebrow">Core Services</p>
        <h2 className="section-title">Everything you need to grow online</h2>
        <div className="grid-3">
          {services.map((service) => (
            <article className="info-card" key={service.title}>
              <h3>{service.title}</h3>
              <ul className="clean-list">
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-block process-wrap">
        <p className="eyebrow">Our Process</p>
        <h2 className="section-title">Simple, transparent, outcome-driven</h2>
        <div className="process-grid">
          {process.map((item) => (
            <article key={item.step} className="process-card">
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container cta-banner">
        <h2>Ready to transform your digital presence?</h2>
        <p>Let&apos;s design and launch a website that directly supports your business goals.</p>
        <Link href="/contact" className="btn btn-primary">
          Contact Sitecraft4u
        </Link>
      </section>
    </>
  );
}
