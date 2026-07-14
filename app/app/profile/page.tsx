import Link from "next/link";

export default function Profil() {
  return (
    <main className="page">
      <Link className="back-link" href="/">
        ← Kembali ke Beranda
      </Link>

      <p className="label">PROFIL</p>
      <h1>Perkenalkan, saya [Nama Kamu].</h1>

      <div className="content-grid">
        <section>
          <h2>Tentang Saya</h2>
          <p>
            Saya adalah mahasiswa yang sedang mempelajari dasar pengembangan
            website menggunakan HTML, CSS, JavaScript, dan Next.js.
          </p>
        </section>

        <section>
          <h2>Keahlian yang Dipelajari</h2>
          <ul>
            <li>HTML dan CSS</li>
            <li>JavaScript</li>
            <li>React</li>
            <li>Next.js</li>
          </ul>
        </section>
      </div>

      <Link className="button" href="/portofolio">
        Lihat Portofolio →
      </Link>
    </main>
  );
}