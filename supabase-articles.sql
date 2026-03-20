-- Bảng bài viết tin tức. Chạy trong Supabase SQL Editor (1 lần).

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  content text,
  created_at timestamptz default now()
);

alter table public.articles enable row level security;

drop policy if exists "Allow all articles" on public.articles;
create policy "Allow all articles"
  on public.articles for all
  using (true)
  with check (true);

create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_created_at on public.articles(created_at desc);
