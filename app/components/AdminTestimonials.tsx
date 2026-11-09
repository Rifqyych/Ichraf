"use client";

import { useState, type FormEvent } from "react";

type Testimonial = {
  id: string;
  member_slug: string;
  project_title: string | null;
  name: string;
  role: string;
  message: string;
  created_at: string;
};

export default function AdminTestimonials() {
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<Testimonial[]>([]);
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function loadPending(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsLoading(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/testimoni", {
        headers: { "x-admin-password": password },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Tidak dapat memuat testimoni.");
      setItems(result);
      setNotice(`${result.length} testimoni menunggu persetujuan.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }

  async function review(id: string, status: "approved" | "rejected") {
    setNotice("");
    try {
      const response = await fetch("/api/admin/testimoni", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ id, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Status testimoni gagal diperbarui.");
      setItems((current) => current.filter((item) => item.id !== id));
      setNotice(status === "approved" ? "Testimoni disetujui dan akan tampil di website." : "Testimoni ditolak.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Terjadi kesalahan.");
    }
  }

  return (
    <section className="admin-content-card admin-testimonials">
      <h2>Tinjau kiriman testimoni</h2>
      <p className="muted-note">Masukkan kata sandi admin untuk melihat kiriman yang menunggu persetujuan.</p>
      <form className="admin-login-form" onSubmit={loadPending}>
        <label htmlFor="admin-password">Kata sandi admin</label>
        <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button type="submit" disabled={isLoading}>{isLoading ? "Memuat…" : "Muat kiriman"}</button>
      </form>
      {notice && <p className="form-status" role="status">{notice}</p>}
      <div className="pending-list">
        {items.map((item) => (
          <article className="pending-testimonial" key={item.id}>
            <p className="eyebrow">{item.member_slug}{item.project_title ? ` · ${item.project_title}` : ""}</p>
            <blockquote>“{item.message}”</blockquote>
            <p><strong>{item.name}</strong>{item.role ? ` · ${item.role}` : ""}</p>
            <p className="muted-note">Dikirim {new Date(item.created_at).toLocaleString("id-ID")}</p>
            <div className="review-actions">
              <button type="button" onClick={() => review(item.id, "approved")}>Setujui</button>
              <button type="button" className="secondary-review" onClick={() => review(item.id, "rejected")}>Tolak</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
