import Link from "next/link";
import { members } from "./data/team";

export default function HomePage() {
  return (
    <main>
      <section className="hero container">
        <div>
          <p className="eyebrow">TEAM PORTFOLIO / RPL</p>
          <h1>
            Dua siswa.
            <br />
            Satu proses belajar.
          </h1>
          <p className="hero-text">
            Website ini berisi profil dan kumpulan project dari Asraf dan
            Ichwan, siswa Rekayasa Perangkat Lunak.
          </p>

          <Link className="main-button" href="/portofolio">
            Lihat Semua Project
          </Link>
        </div>

        <div className="hero-board" aria-hidden="true">
          <span>TEAM</span>
          <strong>RPL</strong>
          <i>02</i>
        </div>
      </section>

      <section className="container member-section">
        <div className="section-title">
          <p className="eyebrow">ANGGOTA TIM</p>
          <h2>Pilih profil untuk melihat perjalanan belajar masing-masing.</h2>
        </div>

        <div className="member-grid">
          {members.map((member, index) => (
            <article className={`member-card ${member.color}`} key={member.slug}>
              <span className="member-number">0{index + 1}</span>
              <div className="member-initials">{member.initials}</div>

              <div>
                <p>{member.role}</p>
                <h3>{member.name}</h3>
              </div>

              <div className="member-links">
                <Link href={`/profile/${member.slug}`}>Profil →</Link>
                <Link href={`/portofolio/${member.slug}`}>Project →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}