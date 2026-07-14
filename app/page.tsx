import Link from "next/link";

export default function Home() {
  return (
    <main className="home">
      <section className="hero">
        <p className="label">TEAM 2 · NEXT.JS</p>
        <h1>Halo, saya mahasiswa yang sedang belajar membuat website.</h1>
        <p className="description">
          Ini adalah halaman utama sederhana yang berisi navigasi ke profil
          dan portofolio saya.
        </p>

        <nav className="menu">
          <Link href="/profil">Lihat Profil</Link>
          <Link href="/portofolio">Lihat Portofolio</Link>
        </nav>
      </section>

      <section className="info">
        <div>
          <p className="label">Tentang Website</p>
          <h2>Belajar membuat halaman dengan App Router Next.js.</h2>
        </div>

        <p>
          Setiap folder di dalam <code>app</code> dapat menjadi alamat halaman
          baru, selama di dalamnya terdapat file <code>page.tsx</code>.
        </p>
      </section>
    </main>
  );
}