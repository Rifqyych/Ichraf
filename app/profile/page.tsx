import Link from "next/link";
import { members } from "../data/team";

export default function ProfilePage() {
  return (
    <main className="container listing-page">
      <p className="eyebrow">PROFIL TIM</p>
      <h1>Pilih anggota tim.</h1>
      <p className="page-description">
        Setiap anggota memiliki profil, keahlian yang dipelajari, dan portfolio
        project masing-masing.
      </p>

      <div className="profile-list">
        {members.map((member) => (
          <Link
            className={`profile-row ${member.color}`}
            href={`/profile/${member.slug}`}
            key={member.slug}
          >
            <span>{member.initials}</span>
            <div>
              <p>{member.role}</p>
              <h2>{member.name}</h2>
            </div>
            <b>→</b>
          </Link>
        ))}
      </div>
    </main>
  );
}