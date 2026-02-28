create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  language text not null,
  code text not null,
  ai_response jsonb not null,
  created_at timestamptz not null default now()
);
