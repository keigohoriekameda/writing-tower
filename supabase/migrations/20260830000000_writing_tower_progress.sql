-- Writing Tower: cloud progress storage + writing-tower product registration.
--
-- Reuses the shared Project Skyline schema from eiken-5-adventure's
-- 20260714120000_initial_learning_platform.sql (same Supabase Project):
--   profiles / products / user_product_access / Supabase Auth (login_id@<domain> synthetic
--   email + password).
-- Does NOT modify profiles / products / user_product_access / mission_progress / day_progress.
--
-- day_progress (also part of that shared schema) was evaluated for reuse but is tightly
-- coupled to the word/sentence/conversation/listening mission model: mission_progress has a
-- CHECK constraint limiting mission_type to those four values, and day_progress can only be
-- written through the complete_day() RPC, which requires all four mission types to be
-- 'completed' first. Writing Tower has a single per-day activity (one essay submission), so
-- forcing four synthetic mission_progress rows per day to satisfy that gate would misrepresent
-- the data and couple Writing Tower to another app's domain model. A small dedicated table
-- is added instead, following the exact same conventions (schema shape, RLS design, RPC-only
-- writes, shared set_updated_at() trigger) as day_progress.
--
-- STOP: review against the real `products` table before applying to production.

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. Register the writing-tower product (idempotent).
-- ============================================================
-- Per Project Skyline Admin's per-app registration convention
-- (see project-skyline-admin/docs/products-registration-notes.md), the application repository
-- that owns a product_code carries its own idempotent registration migration for it. This
-- repository is that owner for 'writing-tower'.
insert into products (product_code, name)
values ('writing-tower', 'Writing Tower')
on conflict (product_code) do nothing;

-- ============================================================
-- 2. set_updated_at() — re-declared identically (idempotent; already defined by
--    eiken-5-adventure's 20260714120000_initial_learning_platform.sql in the same project),
--    so this migration does not depend on migration ordering. Same pattern as
--    project-skyline-admin's 20260718000000_admin_platform.sql.
-- ============================================================
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- 3. writing_tower_progress
-- ============================================================
-- One row per completed Day. Rows are insert-only (via complete_writing_tower_day below) and
-- never updated or deleted, so progress can never regress: once a Day is recorded as complete,
-- it stays complete.
create table if not exists writing_tower_progress (
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

drop trigger if exists writing_tower_progress_set_updated_at on writing_tower_progress;
create trigger writing_tower_progress_set_updated_at
  before update on writing_tower_progress
  for each row execute function set_updated_at();

-- unique(user_id, product_id, day_number) covers the lookups this table needs
-- (per-user × per-day), so no additional index is created.

alter table writing_tower_progress enable row level security;

-- select: 本人のみ。INSERT/UPDATE/DELETEはpolicyを作成せず、complete_writing_tower_day
-- RPC（SECURITY DEFINER）経由のみで書き込み可能とする（day_progressと同じ設計方針）。
drop policy if exists "writing_tower_progress_select_own" on writing_tower_progress;
create policy "writing_tower_progress_select_own"
  on writing_tower_progress for select
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- 4. complete_writing_tower_day RPC
-- ============================================================
-- user_idはauth.uid()から取得し、外部引数では受け取らない（他人のuser_idを操作させないため）。
-- ON CONFLICT DO NOTHINGのため同じDayを何度呼んでも安全（冪等）。既存行はUPDATEされないため、
-- 一度完了したDayが後から変更・削除されることはない（進捗を後退させない）。
create or replace function complete_writing_tower_day(
  p_day_number integer
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_newly_completed boolean;
begin
  if v_user_id is null then
    raise exception 'complete_writing_tower_day requires an authenticated user';
  end if;

  if p_day_number is null or p_day_number <= 0 then
    raise exception 'invalid day_number: %', p_day_number;
  end if;

  -- Productが存在し、activeであることを確認する
  if not exists (
    select 1
    from products p
    where p.product_code = 'writing-tower'
      and p.is_active = true
  ) then
    raise exception 'product writing-tower is not active or does not exist';
  end if;

  -- RPC内でも呼び出し元を信用せず、Product accessを再確認する
  if not exists (
    select 1
    from user_product_access upa
    where upa.user_id = v_user_id
      and upa.product_id = 'writing-tower'
      and upa.is_active = true
      and (upa.expires_at is null or upa.expires_at > now())
  ) then
    raise exception 'no active product access for writing-tower';
  end if;

  with upsert as (
    insert into writing_tower_progress (user_id, product_id, day_number, completed_at)
    values (v_user_id, 'writing-tower', p_day_number, now())
    on conflict (user_id, product_id, day_number) do nothing
    returning 1
  )
  select exists (select 1 from upsert) into v_newly_completed;

  return v_newly_completed;
end;
$$;

revoke all on function complete_writing_tower_day(integer) from public;
revoke all on function complete_writing_tower_day(integer) from anon;
grant execute on function complete_writing_tower_day(integer) to authenticated;
