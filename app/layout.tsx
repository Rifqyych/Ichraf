import type { Metadata } from "next";
import Link from "next/link";
import LiveContentRefresh from "./components/LiveContentRefresh";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Team RPL",
  description: "Portfolio Zaki dan Rifqy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <header className="site-header">
          <div className="container header-content">
            <Link className="brand" href="/">
              RPL<span>/02</span>
            </Link>

            <nav className="navigation">
              <Link href="/#intro">Perkenalan</Link>
              <Link href="/#projects">Karya</Link>
              <Link href="/#skills">Skills</Link>
              <Link href="/#certificates">Sertifikat</Link>
              <Link href="/#testimonials">Testimoni</Link>
              <Link href="/#contact">Kontak</Link>
              <Link href="/profile">Profil Tim</Link>
              <Link href="/portofolio/blog">Blog</Link>
              <Link href="/proyek">Proyek</Link>
            </nav>
          </div>
        </header>

        <LiveContentRefresh />
        {children}

        <footer className="site-footer">
          <div className="container">
            <p>Portfolio Team RPL — Zaki & Rifqy</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
