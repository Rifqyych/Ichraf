import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ahmad Chairul Ichraf | Portfolio",
  description: "Website portfolio Ahmad Chairul Ichraf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <header className="site-header">
          <div className="container nav-wrapper">
            <Link className="brand" href="/">
              ACI<span>.</span>
            </Link>

            <nav className="navigation">
              <Link href="/">Beranda</Link>
              <Link href="/profile">Profil</Link>
              <Link href="/portofolio">Portofolio</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="container">
            <p>© 2026 Ahmad Chairul Ichraf</p>
          </div>
        </footer>
      </body>
    </html>
  );
}