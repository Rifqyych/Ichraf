import { NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "../../lib/supabase-rest";
import { members } from "../../data/team";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getSupabaseConfig();
  if (!config) return NextResponse.json({ error: "Penyimpanan testimoni belum dikonfigurasi." }, { status: 503 });

  const response = await fetch(
    `${config.url}/rest/v1/testimonials?select=id,member_slug,project_title,name,role,message&status=eq.approved&order=created_at.desc`,
    { headers: supabaseHeaders(config.serviceKey), cache: "no-store" },
  );
  if (!response.ok) return NextResponse.json({ error: "Testimoni tidak dapat dimuat." }, { status: 502 });
  return NextResponse.json(await response.json(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const config = getSupabaseConfig();
  if (!config) return NextResponse.json({ error: "Form testimoni belum aktif. Admin perlu mengatur database terlebih dahulu." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Isi formulir tidak valid." }, { status: 400 });
  }

  if (!body || typeof body !== "object") return NextResponse.json({ error: "Isi formulir tidak valid." }, { status: 400 });
  const data = body as Record<string, unknown>;
  const member = members.find((item) => item.slug === data.memberSlug);
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const role = typeof data.role === "string" ? data.role.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  const projectTitle = typeof data.projectTitle === "string" && data.projectTitle ? data.projectTitle : null;

  if (!member || !name || name.length > 80 || role.length > 100 || message.length < 5 || message.length > 1000 || data.consent !== true) {
    return NextResponse.json({ error: "Periksa kembali isian dan persetujuan publikasi." }, { status: 400 });
  }
  if (projectTitle && !member.projects.some((project) => project.title === projectTitle)) {
    return NextResponse.json({ error: "Project yang dipilih tidak valid." }, { status: 400 });
  }

  const response = await fetch(`${config.url}/rest/v1/testimonials`, {
    method: "POST",
    headers: supabaseHeaders(config.serviceKey, { Prefer: "return=minimal" }),
    body: JSON.stringify({ member_slug: member.slug, project_title: projectTitle, name, role, message, consent: true, status: "pending" }),
    cache: "no-store",
  });
  if (!response.ok) return NextResponse.json({ error: "Testimoni belum dapat disimpan. Coba lagi nanti." }, { status: 502 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
