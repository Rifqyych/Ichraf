import Link from "next/link";

const skills = ["HTML", "CSS", "JavaScript", "React", "Next.js"];

export default function ProfilePage() {
  return (
    <main>
      <section className="profile-cover frame">
        <div className="profile-title">
          <p className="section-code">01 — PROFILE</p>

          <div className="name-block">
            <span className="name-number">ACI / 26</span>
            <h1>Ahmad Chairul Ichraf</h1>
          </div>

          <p>
            Mahasiswa yang sedang menjelajahi dunia frontend, desain antarmuka,
            dan cara membuat pengalaman digital yang lebih jelas.
          </p>
        </div>

        <div className="identity-card">
          <div className="identity-initials">AC</div>
          <div>
            <span>STATUS</span>
            <strong>Student &<br />Frontend Learner</strong>
          </div>
          <p>Fokus utama: membangun fondasi yang kuat lewat latihan kecil.</p>
        </div>
      </section>

      <section className="frame profile-content">
        <article className="story-card">
          <p className="section-code">02 — TENTANG SAYA</p>
          <h2>Bukan tentang cepat, tetapi tentang konsisten.</h2>
          <p>
            Saya menikmati proses memahami bagaimana sebuah website dibuat:
            dari struktur halaman, warna, sampai navigasi yang membuat pengguna
            tidak bingung ketika berpindah halaman.
          </p>
        </article>

        <aside className="skills-card">
          <p className="section-code">03 — TOOLKIT</p>
          <h2>Yang sedang saya pelajari.</h2>

          <div className="skill-tags">
            {skills.map((skill, index) => (
              <span key={skill}>
                0{index + 1} {skill}
              </span>
            ))}
          </div>
        </aside>
      </section>

      <section className="frame profile-bottom">
        <div className="goal-panel">
          <p className="section-code">04 — ARAH BELAJAR</p>
          <h2>
            Membuat website yang punya fungsi jelas dan tampilan yang punya
            karakter.
          </h2>
        </div>

        <Link className="button button-orange" href="/portofolio">
          Lihat Portofolio →
        </Link>
      </section>
    </main>
  );
}