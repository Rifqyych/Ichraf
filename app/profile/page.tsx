import Image from "next/image";
import Link from "next/link";
import { members } from "../data/team";

export default function ProfilePage() {
  return (
    <main className="listing-page container">
      <p className="eyebrow">PROFIL TIM</p>

      <h1>Pilih anggota tim</h1>

      <p className="page-description">
        Setiap anggota memiliki profil, keahlian yang dipelajari, dan portofolio
        project masing-masing.
      </p>

      <div className="profile-list">
        {members.map((member) => (
          <Link
            href={`/profile/${member.slug}`}
            key={member.slug}
            className={`profile-row ${member.color}`}
          >
            <div className="profile-photo">
              <Image
                src={`/images/${member.slug}.png`}
                alt={member.name}
                width={58}
                height={58}
              />
            </div>

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