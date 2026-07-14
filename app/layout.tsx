import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dimas Ardiansyah | Portfolio",
  description: "Portfolio pribadi",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            <span className="brand-mark">DA</span>
            <span>Dimas Ardiansyah</span>
          </Link>

          <nav className="navigation">
            <Link href="/">Beranda</Link>
            <Link href="/profil">Profil</Link>
            <Link href="/portofolio">Portofolio</Link>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <p>© 2026 Dimas Ardiansyah. Dibuat untuk tugas web.</p>
          <a href="mailto:dimas@example.com">dimas@example.com</a>
        </footer>
      </body>
    </html>
  );
}