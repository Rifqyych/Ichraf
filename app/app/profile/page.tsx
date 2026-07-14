import Link from "next/link";

const skills = ["HTML", "CSS", "JavaScript", "React", "Next.js"];

export default function Profile() {
  return (
    <main className="container page-content">
      <section className="page-heading">
        <p className="eyebrow">Profil</p>
        <h1>Perkenalkan, saya Ahmad Chairul Ichraf.</h1>
        <p>
          Saya adalah mahasiswa yang tertarik mempelajari pengembangan website
          dan desain antarmuka yang mudah digunakan.
        </p>
      </section>

      <section className="profile-grid">
        <article className="info-card">
          <p className="card-label">TENTANG SAYA</p>
          <h2>Belajar dari proses</h2>
          <p>
            Saya senang mencoba hal baru dalam dunia teknologi, terutama
            membuat tampilan website yang bersih dan nyaman dilihat.
          </p>
        </article>

        <article className="info-card">
          <p className="card-label">KEAHLIAN</p>
          <h2>Yang sedang dipelajari</h2>
          <ul className="skill-list">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </article>

        <article className="info-card">
          <p className="card-label">TUJUAN</p>
          <h2>Terus berkembang</h2>
          <p>
            Saya ingin memahami cara membuat aplikasi web yang tidak hanya
            berjalan dengan baik, tetapi juga mudah dipahami pengguna.
          </p>
        </article>
      </section>

      <section className="bottom-cta">
        <div>
          <p className="eyebrow">Selanjutnya</p>
          <h2>Lihat beberapa latihan project saya.</h2>
        </div>

        <Link className="button primary-button" href="/portofolio">
          Buka Portofolio
        </Link>
      </section>
    </main>
  );
}