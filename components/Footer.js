import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/brochure", label: "Brochure" },
  { href: "/contact", label: "Contact Us" },
];

const services = [
  "Business Website Solutions",
  "Online Store Setup",
  "Brand Visibility Growth",
  "Website Maintenance & Support",
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Image
            src="/sitecraft4u-logo.svg"
            alt="Sitecraft4u logo"
            width={220}
            height={64}
            className="footer-logo"
          />
          <p>
            Sitecraft4u builds conversion-focused websites and scalable backend systems.
          </p>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3>Services</h3>
          <ul>
            {services.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact</h3>
          <ul>
            <li>
              <a href="tel:+15551234567">+1 (555) 123-4567</a>
            </li>
            <li>
              <a href="mailto:hello@sitecraft4u.com">hello@sitecraft4u.com</a>
            </li>
            <li>Times Square, New York, NY</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>{"\u00A9"} {new Date().getFullYear()} Sitecraft4u. All rights reserved.</p>
        <p>Designed for growth-focused businesses.</p>
      </div>
    </footer>
  );
}
