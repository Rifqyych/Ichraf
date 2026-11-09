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

export default function TestimonialsSection({ members }: { members: MemberOption[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [memberSlug, setMemberSlug] = useState(members[0]?.slug ?? "");
  const [projectTitle, setProjectTitle] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/testimoni", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Not available");
        return response.json();
      })
      .then((data: Testimonial[]) => setTestimonials(data))
      .catch(() => setLoadError(true));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/testimoni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberSlug, projectTitle, name, role, message, consent }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Testimoni gagal dikirim.");

      setStatus("Terima kasih! Testimoni terkirim dan akan tampil setelah disetujui admin.");
      setProjectTitle("");
      setName("");
      setRole("");
      setMessage("");
      setConsent(false);
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
        <p className="form-intro">Kiriman akan ditinjau admin dan hanya ditampilkan setelah disetujui.</p>
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
        <label className="consent-field">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
          <span>Saya mengizinkan testimoni ini ditampilkan di website setelah ditinjau admin.</span>
        </label>
        <button className="main-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Mengirim…" : "Kirim untuk ditinjau"}
        </button>
        {status && <p className="form-status" role="status">{status}</p>}
      </form>
    </div>
  );
}
