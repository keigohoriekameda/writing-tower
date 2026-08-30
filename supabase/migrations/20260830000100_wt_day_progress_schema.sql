-- Writing Tower's own per-day completion table, namespaced with a `wt_`
-- prefix to avoid colliding with other Project Skyline apps' progress
-- tables in the same shared Supabase project (mirrors the `sjsh_` prefix
-- used by skyline-j3-social-history). Column names/types mirror the
-- shared `day_progress` table (eiken-5-adventure's
-- 20260714120000_initial_learning_platform.sql) for consistency, even
-- though this is a separate table (see migration README note on why
-- day_progress/mission_progress itself isn't reused: complete_day()
-- there requires 4 eiken5-specific mission_types per day, which doesn't
-- fit Writing Tower's one-essay-per-day model).
create table if not exists wt_day_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references products(product_code) on delete cascade
    check (product_id = 'writing-tower'),
  day_number integer not null check (day_number > 0),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id, day_number)
);

create index if not exists wt_day_progress_user_id_idx
  on wt_day_progress (user_id, product_id);

-- Self-contained (doesn't assume eiken-5-adventure's own copy of this
-- function has been applied yet) — matches skyline-j3-social-history's
-- sjsh_progress_schema.sql, which does the same for the same reason.
-- CREATE OR REPLACE makes redefining it, if it already exists
-- identically, harmless.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists wt_day_progress_set_updated_at on wt_day_progress;
create trigger wt_day_progress_set_updated_at
  before update on wt_day_progress
  for each row execute function set_updated_at();
