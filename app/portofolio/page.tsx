const projects = [
  {
    number: "01",
    title: "Website Biodata",
    category: "HTML & CSS",
    description:
      "Latihan membuat halaman biodata sederhana dengan struktur yang rapi.",
  },
  {
    number: "02",
    title: "Halaman Produk",
    category: "Frontend",
    description:
      "Latihan membuat tampilan produk dengan informasi harga dan menu navigasi.",
  },
  {
    number: "03",
    title: "Website Portfolio",
    category: "Next.js",
    description:
      "Project menggunakan App Router dengan halaman beranda, profil, dan portofolio.",
  },
];

export default function Portofolio() {
  return (
    <main className="container page-content">
      <section className="page-heading">
        <p className="eyebrow">Portofolio</p>
        <h1>Beberapa project latihan saya.</h1>
        <p>
          Setiap project membantu saya memahami cara membuat website dengan
          struktur, tampilan, dan navigasi yang lebih baik.
        </p>
      </section>

      <section className="project-list">
        {projects.map((project) => (
          <article className="project-card" key={project.number}>
            <span className="project-number">{project.number}</span>

            <div>
              <p className="card-label">{project.category}</p>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>

            <span className="arrow">↗</span>
          </article>
        ))}
      </section>
    </main>
  );
}