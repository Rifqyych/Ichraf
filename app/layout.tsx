import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ahmad Chairul Ichraf",
  description: "Portfolio pribadi Ahmad Chairul Ichraf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <header className="topbar">
          <div className="frame topbar-content">
            <Link className="logo" href="/">
              ACI<span>+</span>
            </Link>

            <nav className="nav-links">
              <Link href="/">Beranda</Link>
              <Link href="/profile">Profil</Link>
              <Link href="/portofolio">Portofolio</Link>
            </nav>

          </div>
        </header>

        {children}

        <footer className="footer">
          <div className="frame footer-content">
            <strong>Ahmad Chairul Ichraf</strong>
            <span>Belajar, mencoba, berkembang.</span>
            <span>© 2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}