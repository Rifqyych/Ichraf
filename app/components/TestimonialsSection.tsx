"use client";

import { FormEvent, useEffect, useState } from "react";

type MemberOption = {
  slug: string;
  name: string;
  projects: { title: string }[];
};

type Testimonial = {
  id: string;
  member_slug: string;
  project_title: string | null;
  name: string;
  role: string;
  message: string;
};

const testimonialsApiUrl = process.env.NEXT_PUBLIC_TESTIMONI_API_URL
  || "http://localhost/portfolio-api/testimonials.php";

export default function TestimonialsSection({ members }: { members: MemberOption[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [memberSlug, setMemberSlug] = useState(members[0]?.slug ?? "");
  const [projectTitle, setProjectTitle] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadTestimonials() {
      try {
        const response = await fetch(testimonialsApiUrl, { cache: "no-store" });
        if (!response.ok) throw new Error("Testimoni tidak dapat dimuat.");
        const data: Testimonial[] = await response.json();
        if (isActive) {
          setTestimonials(data);
          setLoadError(false);
        }
      } catch {
        if (isActive) setLoadError(true);
      }
    }

    void loadTestimonials();
    const refreshTimer = window.setInterval(loadTestimonials, 5000);
    window.addEventListener("focus", loadTestimonials);

    return () => {
      isActive = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", loadTestimonials);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(testimonialsApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberSlug, projectTitle, name, role, message }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Testimoni gagal dikirim.");

      setStatus("Terima kasih! Testimoni terkirim dan akan tampil setelah disetujui admin.");
      setProjectTitle("");
      setName("");
      setRole("");
      setMessage("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Testimoni gagal dikirim.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="testimonial-area">
      <div className="published-testimonials">
        {testimonials.length ? testimonials.map((testimonial) => {
          const member = members.find((item) => item.slug === testimonial.member_slug);
          return (
            <article className="empty-content-card testimonial-card" key={testimonial.id}>
              <blockquote>“{testimonial.message}”</blockquote>
              <p><strong>{testimonial.name}</strong>{testimonial.role ? ` · ${testimonial.role}` : ""}</p>
              <span className="muted-note">
                Untuk {member?.name ?? "anggota tim"}{testimonial.project_title ? ` — ${testimonial.project_title}` : ""}
              </span>
            </article>
          );
        }) : (
          <div className="empty-content-card">
            <strong>{loadError ? "Penyimpanan testimoni belum disiapkan." : "Belum ada testimoni yang disetujui."}</strong>
            <p>{loadError ? "Admin perlu menghubungkan database sebelum formulir dapat menerima kiriman." : "Testimoni yang dikirim akan ditampilkan di sini setelah diperiksa admin."}</p>
          </div>
        )}
      </div>

      <form className="testimonial-form" onSubmit={handleSubmit}>
        <p className="eyebrow">KIRIM TESTIMONI</p>
        <h3>Ceritakan pengalamanmu.</h3>
        <p className="form-intro">Kiriman akan ditinjau admin. Setelah disetujui, testimoni muncul otomatis dalam beberapa detik.</p>
        <div className="form-grid">
          <label>
            Untuk anggota
            <select value={memberSlug} onChange={(event) => { setMemberSlug(event.target.value); setProjectTitle(""); }} required>
              {members.map((member) => <option key={member.slug} value={member.slug}>{member.name}</option>)}
            </select>
          </label>
          <label>
            Project (opsional)
            <select value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)}>
              <option value="">Umum</option>
              {members.find((member) => member.slug === memberSlug)?.projects.map((project) => (
                <option key={project.title} value={project.title}>{project.title}</option>
              ))}
            </select>
          </label>
          <label>
            Nama
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required />
          </label>
          <label>
            Hubungan / peran (opsional)
            <input value={role} onChange={(event) => setRole(event.target.value)} maxLength={100} placeholder="Contoh: Guru pembimbing" />
          </label>
          <label className="form-full-width">
            Testimoni
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} minLength={5} maxLength={1000} rows={5} required />
          </label>
        </div>
        <button className="main-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Mengirim…" : "Kirim untuk ditinjau"}
        </button>
        {status && <p className="form-status" role="status">{status}</p>}
      </form>
    </div>
  );
}
