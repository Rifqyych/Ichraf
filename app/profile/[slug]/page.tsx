import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMember, members } from "../../data/team";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return members.map((member) => ({ slug: member.slug }));
}

export default async function MemberProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const member = getMember(slug);

  if (!member) {
    notFound();
  }

  return (
    <main className="container member-profile-page">
      <section className={`member-profile-hero ${member.color}`}>
        <div className="profile-photo-large">
          <Image
            src={`/images/${member.slug}.png`}
            alt={member.name}
            width={320}
            height={320}
            className="profile-image"
            priority
          />
        </div>

        <div>
          <p className="eyebrow">PROFIL ANGGOTA</p>
          <h1>{member.name}</h1>
          <p className="member-role">{member.role}</p>
          <p className="member-about">{member.about}</p>

          <Link className="dark-link" href={`/portofolio/${member.slug}`}>
            Lihat portofolio {member.name} &rarr;
          </Link>
        </div>
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <p className="eyebrow">BASIC RPL</p>
          <h2>Dasar Rekayasa Perangkat Lunak</h2>
          <p>
            Mempelajari dasar pemrograman, pembuatan website, desain antarmuka,
            pengelolaan basis data sederhana, dan Git untuk menyimpan perubahan
            kode.
          </p>
        </article>

        <article className="detail-card">
          <p className="eyebrow">SKILL YANG DIPELAJARI</p>
          <div className="skill-list">
            {member.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}