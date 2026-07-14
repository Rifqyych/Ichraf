import Link from "next/link";

const projects = [
  {
    number: "01",
    title: "Website Biodata",
    type: "HTML & CSS",
    description:
      "Latihan membuat halaman biodata dengan struktur konten yang sederhana dan rapi.",
  },
  {
    number: "02",
    title: "Halaman Produk",
    type: "Frontend Practice",
    description:
      "Eksplorasi tampilan produk, informasi harga, dan penataan konten yang mudah dibaca.",
  },
  {
    number: "03",
    title: "Portfolio Next.js",
    type: "Next.js App Router",
    description:
      "Website dengan halaman beranda, profil, serta portofolio menggunakan sistem routing Next.js.",
  },
];

export default function PortofolioPage() {
  return (
    <main className="frame portfolio-page">
      <section className="portfolio-heading">
        <p className="section-code">01 — PORTOFOLIO</p>
        <h1>Project kecil, proses yang besar.</h1>
        <p>
          Kumpulan latihan yang saya gunakan untuk memahami dasar pembuatan
          website dan antarmuka.
        </p>
      </section>

      <section className="project-grid">
        {projects.map((project, index) => (
          <article
            className={`project-item project-item-${index + 1}`}
            key={project.number}
          >
            <div className="project-top">
              <span>{project.number}</span>
              <span>{project.type}</span>
            </div>

            <div>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>

            <span className="project-arrow">↗</span>
          </article>
        ))}
      </section>

      <div className="portfolio-end">
        <p>Masih belajar dan akan terus menambah project baru.</p>
        <Link className="underlined-link" href="/profile">
          Kembali ke profil →
        </Link>
      </div>
    </main>
  );
}