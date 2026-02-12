import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import VisitorTracker from "../components/VisitorTracker";
import AdminSessionGuard from "../components/AdminSessionGuard";

export const metadata = {
  title: "Sitecraft4u",
  description: "Web solutions that are practical, modern, and scalable.",
  icons: {
    icon: "/sitecraft4u-logo.svg",
    shortcut: "/sitecraft4u-logo.svg",
    apple: "/sitecraft4u-logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminSessionGuard />
        <VisitorTracker />
        <div className="site-shell">
          <Header />
          <main className="content-wrap">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
