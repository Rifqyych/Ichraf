import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Team RPL",
  description: "Portfolio Asraf dan Ichwan",
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
          <div className="container header-content">
            <Link className="brand" href="/">
              RPL<span>/02</span>
            </Link>

            <nav className="navigation">
              <Link href="/">Beranda</Link>
              <Link href="/profile">Profil Tim</Link>
              <Link href="/portofolio">Portofolio</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="container">
            <p>Portfolio Team RPL — Asraf & Ichwan</p>
          </div>
        </footer>
      </body>
    </html>
  );
}