import Image from "next/image";
import Link from "next/link";
import { getTeamMembers } from "../data/getTeamMembers";

export default async function PortofolioPage() {
  const members = await getTeamMembers();

  return (
    <main className="container listing-page">
      <p className="eyebrow">PORTOFOLIO TIM</p>
      <h1>Project dari setiap anggota.</h1>

      <p className="page-description">
        Klik salah satu anggota untuk melihat project yang telah dikerjakan.
      </p>

      <div className="portfolio-choice">
        {members.map((member) => (
          <Link
            key={member.slug}
            href={`/portofolio/${member.slug}`}
            className={`portfolio-person ${member.color}`}
          >
            <div className="portfolio-person-info">
              <Image
                src={member.photo}
                alt={member.name}
                width={70}
                height={70}
                className="portfolio-person-photo"
              />

              <div>
                <p>{member.role}</p>
                <h2>{member.name}</h2>
              </div>
            </div>

            <strong>
              {member.projects.length} Project <b>→</b>
            </strong>
          </Link>
        ))}
      </div>
    </main>
  );
}
