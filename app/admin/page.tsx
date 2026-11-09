import Link from "next/link";
import { members } from "../data/team";
import AdminTestimonials from "../components/AdminTestimonials";

export default function AdminPage() {
  const projectCount = members.reduce((total, member) => total + member.projects.length, 0);
  const certificateCount = members.reduce((total, member) => total + member.certificates.length, 0);

  return (
    <main className="container listing-page admin-page">
      <p className="eyebrow">PANEL ADMIN</p>
      <h1>Kelola portofolio tim.</h1>
      <p className="page-description">
        Ringkasan konten yang saat ini tampil di website. Data profil, skills, dan project dikelola di <code>app/data/team.tsx</code>.
      </p>

      <div className="admin-stats">
        <article><strong>{members.length}</strong><span>Anggota</span></article>
        <article><strong>{projectCount}</strong><span>Project</span></article>
        <article><strong>{certificateCount}</strong><span>Sertifikat terdata</span></article>
        <article><strong>{process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY && process.env.ADMIN_PASSWORD ? "Siap" : "Setup"}</strong><span>Form testimoni</span></article>
      </div>

      <section className="admin-content-card">
        <h2>Konten yang perlu dilengkapi</h2>
        <ul>
          <li>Tambahkan sertifikat pada properti <code>certificates</code> setiap anggota, beserta penyelenggara dan tanggalnya.</li>
          <li>Testimoni publik masuk ke antrean di bawah dan baru tampil setelah disetujui.</li>
          <li>Tambahkan kontak langsung untuk anggota yang belum mencantumkannya.</li>
        </ul>
        <p className="muted-note">Form di bawah dipakai untuk menyetujui atau menolak testimoni. Data profil dan project masih dikelola di file data.</p>
      </section>

      <div className="admin-member-list">
        {members.map((member) => (
          <article className="admin-member-row" key={member.slug}>
            <div><strong>{member.name}</strong><span>{member.projects.length} project · {member.skills.length} skills</span></div>
            <Link href={`/profile/${member.slug}`}>Lihat profil →</Link>
          </article>
        ))}
      </div>

      <AdminTestimonials />
    </main>
  );
}
