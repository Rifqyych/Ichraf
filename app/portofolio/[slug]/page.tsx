import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectCard from "../../components/ProjectCard";
import { getMember, members } from "../../data/team";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return members.map((member) => ({ slug: member.slug }));
}

export default async function MemberPortofolioPage({ params }: PageProps) {
  const { slug } = await params;
  const member = getMember(slug);

  if (!member) {
    notFound();
  }

  return (
    <main className="container member-portfolio-page">
      <section className="portfolio-header">
        <Link className="back-link" href="/portofolio">
          &larr; Semua anggota
        </Link>

        <p className="eyebrow">PORTOFOLIO {member.name.toUpperCase()}</p>
        <h1>Project yang dikerjakan {member.name}.</h1>
        <p>
          Klik kartu project untuk melihat deskripsi dan teknologi yang
          digunakan.
        </p>
      </section>

      <section className="project-grid">
        {member.projects.map((project) => (
          <ProjectCard
            key={project.number}
            number={project.number}
            category={project.category}
            title={project.title}
            description={project.description}
            tools={project.tools}
          />
        ))}
      </section>
    </main>
  );
}