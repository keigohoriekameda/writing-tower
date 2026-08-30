-- Writing Tower's own per-day completion table, namespaced with a `wt_`
-- prefix to avoid colliding with other Project Skyline apps' progress
-- tables in the same shared Supabase project (mirrors the `sjsh_` prefix
-- used by skyline-j3-social-history).
create table if not exists wt_day_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references products(product_code) on delete cascade
    check (product_id = 'writing-tower'),
  day integer not null check (day > 0),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id, day)
);

create index if not exists wt_day_progress_user_id_idx
  on wt_day_progress (user_id, product_id);
