import Link from "next/link";

export default function Portofolio() {
  return (
    <main className="page">
      <Link className="back-link" href="/">
        ← Kembali ke Beranda
      </Link>

      <p className="label">PORTOFOLIO</p>
      <h1>Beberapa latihan yang pernah saya buat.</h1>

      <section className="project-list">
        <article className="project">
          <span>01</span>
          <div>
            <h2>Website Biodata</h2>
            <p>
              Latihan membuat halaman biodata sederhana menggunakan HTML dan
              CSS.
            </p>
          </div>
        </article>

        <article className="project">
          <span>02</span>
          <div>
            <h2>Halaman Produk</h2>
            <p>
              Latihan membuat tampilan produk dengan menu dan informasi harga.
            </p>
          </div>
        </article>

        <article className="project">
          <span>03</span>
          <div>
            <h2>Website Next.js</h2>
            <p>
              Website dengan halaman beranda, profil, dan portofolio menggunakan
              App Router.
            </p>
          </div>
        </article>
      </section>

      <Link className="button" href="/profil">
        Buka Profil →
      </Link>
    </main>
  );
}