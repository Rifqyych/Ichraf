import Image from "next/image";
import Link from "next/link";
import { getTeamMembers } from "./data/getTeamMembers";
import TestimonialsSection from "./components/TestimonialsSection";

export default async function HomePage() {
  const members = await getTeamMembers();

  return (
    <main>
      <section className="hero container" id="intro">
        <div>
          <p className="eyebrow">TEAM PORTFOLIO / RPL</p>

          <h1>
            Dua siswa.
            <br />
            Satu proses belajar.
          </h1>

          <p className="hero-text">
            Website ini berisi profil dan kumpulan project dari Zaki dan Rifqy,
            siswa Rekayasa Perangkat Lunak.
          </p>

          <Link className="main-button" href="#projects">
            Lihat Karya
          </Link>
        </div>

        <div className="hero-board" aria-hidden="true">
          <span>TEAM</span>
          <strong>RPL</strong>
          <i>02</i>
        </div>
      </section>

      <section className="container member-section" id="projects">
        <div className="section-title">
          <p className="eyebrow">ANGGOTA TIM</p>

          <h2>
            Pilih profil untuk melihat perjalanan belajar masing-masing.
          </h2>
        </div>

        <div className="member-grid">
          {members.map((member, index) => (
            <article
              className={`member-card ${member.color}`}
              key={member.slug}
            >
              <span className="member-number">0{index + 1}</span>

              <div className="member-photo">
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={150}
                  height={150}
                  priority
                />
              </div>

              <div>
                <p>{member.role}</p>
                <h3>{member.name}</h3>
              </div>

              <div className="member-links">
                <Link href={`/profile/${member.slug}`}>
                  Profil →
                </Link>

                <Link href={`/portofolio/${member.slug}`}>
                  Project →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container checklist-section" id="skills">
        <div className="section-title">
          <p className="eyebrow">SKILLS</p>
          <h2>Keahlian yang sedang dipelajari.</h2>
        </div>
        <div className="checklist-grid">
          {members.map((member) => (
            <article className="checklist-card" key={member.slug}>
              <p className="eyebrow">{member.name}</p>
              <h3>{member.role}</h3>
              <div className="skill-list">
                {member.skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
              <Link className="section-link" href={`/profile/${member.slug}`}>
                Lihat profil →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container checklist-section" id="certificates">
        <div className="section-title">
          <p className="eyebrow">SERTIFIKAT</p>
          <h2>Sertifikat dan pencapaian.</h2>
        </div>
        <div className="checklist-grid">
          {members.map((member) => (
            <article className="empty-content-card" key={member.slug}>
              <p className="eyebrow">{member.name}</p>
              {member.certificates.length ? member.certificates.map((certificate) => (
                <div className="content-entry" key={`${certificate.title}-${certificate.issuer}`}>
                  <strong>{certificate.title}</strong>
                  <p>{certificate.issuer} · {certificate.date}</p>
                  {certificate.url && <a className="section-link" href={certificate.url}>Lihat sertifikat →</a>}
                </div>
              )) : <><strong>Belum ada sertifikat yang ditambahkan.</strong><p>Tambahkan nama sertifikat, penyelenggara, tanggal, dan tautan di data anggota.</p></>}
            </article>
          ))}
        </div>
        <p className="muted-note">Sertifikat dapat ditambahkan saat datanya tersedia.</p>
      </section>

      <section className="container checklist-section" id="testimonials">
        <div className="section-title">
          <p className="eyebrow">TESTIMONI</p>
          <h2>Kata mereka tentang karya kami.</h2>
        </div>
        <TestimonialsSection members={members.map(({ slug, name, projects }) => ({ slug, name, projects: projects.map(({ title }) => ({ title })) }))} />
      </section>

      <section className="container checklist-section" id="contact">
        <div className="section-title">
          <p className="eyebrow">KONTAK & CV</p>
          <h2>Kenali dan hubungi anggota tim.</h2>
        </div>
        <div className="checklist-grid">
          {members.map((member) => (
            <article className="checklist-card contact-card" key={member.slug}>
              <p className="eyebrow">{member.name}</p>
              <h3>{member.role}</h3>
              <p>{member.about}</p>
              <div className="contact-actions">
                <Link className="section-link" href={`/cv/${member.slug}`}>Lihat / cetak CV →</Link>
                {member.contactUrl ? (
                  <a className="section-link" href={member.contactUrl} target="_blank" rel="noreferrer">Hubungi via GitHub →</a>
                ) : (
                  <span className="muted-note">Kontak langsung belum dicantumkan.</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
