import Link from "next/link";
import { getTeamMembers } from "../data/getTeamMembers";

export default async function ProyekPage() {
  const members = await getTeamMembers();
  const projects = members.flatMap((member) =>
    member.projects.map((project) => ({ ...project, memberName: member.name, memberSlug: member.slug })),
  );

  return (
    <main className="container listing-page">
      <p className="eyebrow">PORTOFOLIO TIM</p>
      <h1>Daftar proyek kami.</h1>
      <p className="page-description">Proyek ini dikelola melalui panel admin dan disimpan di database Laragon.</p>

      <div className="project-grid" style={{ marginTop: "42px" }}>
        {projects.map((project) => (
          <article key={`${project.memberName}-${project.number}-${project.title}`} className="detail-card">
            <p className="eyebrow">{project.memberName} · {project.category}</p>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <p>Teknologi: {project.tools.join(", ")}</p>
            {project.linkUrl && <a className="section-link" href={project.linkUrl} target="_blank" rel="noreferrer">{project.linkLabel ?? project.linkUrl} →</a>}
            <Link className="section-link" href={`/portofolio/${project.memberSlug}`}>
              Lihat portofolio →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
