import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CvPrintButton from "../../components/CvPrintButton";
import { members } from "../../data/team";
import { getTeamMember } from "../../data/getTeamMembers";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return members.map((member) => ({ slug: member.slug }));
}

export default async function CvPage({ params }: PageProps) {
  const { slug } = await params;
  const member = await getTeamMember(slug);

  if (!member) notFound();

  return (
    <main className="container cv-page">
      <div className="cv-toolbar no-print">
        <Link className="back-link" href="/">← Kembali ke beranda</Link>
        <CvPrintButton />
      </div>

      <article className="cv-sheet">
        <header className="cv-header">
          <Image src={member.photo} alt={member.name} width={104} height={104} />
          <div>
            <p className="eyebrow">CURRICULUM VITAE</p>
            <h1>{member.name}</h1>
            <p>{member.role}</p>
          </div>
        </header>

        <section className="cv-section">
          <h2>Tentang</h2>
          <p>{member.about}</p>
        </section>

        <section className="cv-section">
          <h2>Keahlian</h2>
          <div className="skill-list">
            {member.skills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </section>

        {member.certificates.length > 0 && (
          <section className="cv-section">
            <h2>Sertifikat</h2>
            <ul>
              {member.certificates.map((certificate) => (
                <li key={`${certificate.title}-${certificate.issuer}`}>
                  {certificate.title} — {certificate.issuer}, {certificate.date}
                  {certificate.url && <> · <a href={certificate.url}>Lihat</a></>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="cv-section">
          <h2>Project</h2>
          <div className="cv-projects">
            {member.projects.map((project) => (
              <article key={`${project.number}-${project.title}`}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p className="muted-note">Teknologi: {project.tools.join(", ")}</p>
                {project.linkUrl && <a href={project.linkUrl}>{project.linkLabel ?? project.linkUrl}</a>}
              </article>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <h2>Kontak</h2>
          {member.contactUrl ? (
            <a href={member.contactUrl}>{member.contactUrl}</a>
          ) : (
            <p>Kontak belum dicantumkan.</p>
          )}
        </section>

        <p className="cv-note">CV ini disusun dari informasi yang tersedia di portofolio tim.</p>
      </article>
    </main>
  );
}
