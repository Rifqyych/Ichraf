create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  member_slug text not null check (member_slug in ('zaki', 'rifqy')),
  project_title text,
  name text not null check (char_length(name) between 1 and 80),
  role text not null default '' check (char_length(role) <= 100),
  message text not null check (char_length(message) between 5 and 1000),
  consent boolean not null default false check (consent = true),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;
grant all on table public.testimonials to service_role;
