import { NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "../../../lib/supabase-rest";

export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  return Boolean(expectedPassword) && request.headers.get("x-admin-password") === expectedPassword;
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Kata sandi admin salah." }, { status: 401 });
  const config = getSupabaseConfig();
  if (!config) return NextResponse.json({ error: "Penyimpanan testimoni belum dikonfigurasi." }, { status: 503 });

  const response = await fetch(
    `${config.url}/rest/v1/testimonials?select=id,member_slug,project_title,name,role,message,created_at&status=eq.pending&order=created_at.asc`,
    { headers: supabaseHeaders(config.serviceKey), cache: "no-store" },
  );
  if (!response.ok) return NextResponse.json({ error: "Kiriman tidak dapat dimuat." }, { status: 502 });
  return NextResponse.json(await response.json(), { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Kata sandi admin salah." }, { status: 401 });
  const config = getSupabaseConfig();
  if (!config) return NextResponse.json({ error: "Penyimpanan testimoni belum dikonfigurasi." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  const data = body as Record<string, unknown>;
  if (typeof data.id !== "string" || !/^[0-9a-f-]{36}$/i.test(data.id) || !["approved", "rejected"].includes(String(data.status))) {
    return NextResponse.json({ error: "ID atau status tidak valid." }, { status: 400 });
  }

  const response = await fetch(`${config.url}/rest/v1/testimonials?id=eq.${encodeURIComponent(data.id)}`, {
    method: "PATCH",
    headers: supabaseHeaders(config.serviceKey, { Prefer: "return=minimal" }),
    body: JSON.stringify({ status: data.status }),
    cache: "no-store",
  });
  if (!response.ok) return NextResponse.json({ error: "Status testimoni tidak dapat diperbarui." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
