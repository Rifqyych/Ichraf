import Link from "next/link";
import { members } from "../data/team";

export default function PortofolioPage() {
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
            className={`portfolio-person ${member.color}`}
            href={`/portofolio/${member.slug}`}
            key={member.slug}
          >
            <div>
              <span>{member.initials}</span>
              <p>{member.role}</p>
              <h2>{member.name}</h2>
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