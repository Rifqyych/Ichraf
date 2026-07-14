import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="hero container">
        <div className="hero-content">
          <p className="eyebrow">Mahasiswa · Web Developer Pemula</p>

          <h1>
            Halo, saya
            <br />
            Ahmad Chairul Ichraf.
          </h1>

          <p className="hero-description">
            Saya sedang belajar membangun website yang rapi, sederhana, dan
            mudah digunakan dengan Next.js.
          </p>

          <div className="hero-buttons">
            <Link className="button primary-button" href="/portofolio">
              Lihat Portofolio
            </Link>
            <Link className="text-button" href="/profile">
              Kenalan dulu →
            </Link>
          </div>
        </div>

        <aside className="profile-card">
          <p className="card-label">SEKARANG BELAJAR</p>
          <h2>Next.js App Router</h2>
          <p>
            Membuat halaman dengan folder <code>app</code>, <code>page.tsx</code>,
            dan navigasi menggunakan <code>Link</code>.
          </p>
        </aside>
      </section>

      <section className="intro-section">
        <div className="container intro-grid">
          <p className="eyebrow">Tentang Website</p>
          <div>
            <h2>
              Website ini dibuat sebagai tempat menyimpan proses belajar dan
              latihan membuat project web.
            </h2>
            <Link className="text-button" href="/profile">
              Baca profil saya →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}