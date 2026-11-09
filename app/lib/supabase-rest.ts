export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceKey) return null;
  return { url: url.replace(/\/$/, ""), serviceKey };
}

export function supabaseHeaders(serviceKey: string, extra?: HeadersInit): HeadersInit {
  return {
    apikey: serviceKey,
    "Content-Type": "application/json",
    ...extra,
  };
}
