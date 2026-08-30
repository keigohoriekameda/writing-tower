-- Mirrors sjsh_check_product_access(): true iff the caller has an active,
-- non-expired grant for the writing-tower product.
create or replace function wt_check_product_access(p_user_id uuid)
returns boolean
language sql
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from user_product_access upa
    join products p on p.product_code = upa.product_id
    where upa.user_id = p_user_id
      and upa.product_id = 'writing-tower'
      and upa.is_active = true
      and (upa.expires_at is null or upa.expires_at > now())
      and p.is_active = true
  );
$$;

revoke all on function wt_check_product_access(uuid) from public;
revoke all on function wt_check_product_access(uuid) from anon;
grant execute on function wt_check_product_access(uuid) to authenticated;

-- Idempotently marks `p_day_number` complete for the calling user.
-- Re-derives auth.uid() itself (never trusts a client-supplied user id,
-- mirroring the shared complete_day() RPC's own v_user_id := auth.uid()
-- pattern), re-checks product access, and takes an advisory lock keyed on
-- (user, day) so concurrent duplicate submissions can't race each other.
create or replace function wt_complete_day(p_day_number integer)
returns table (day_number integer, completed_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  if p_day_number is null or p_day_number < 1 then
    raise exception 'invalid day_number: %', p_day_number;
  end if;

  if not wt_check_product_access(v_user_id) then
    raise exception 'no active product access for writing-tower';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || ':day:' || p_day_number::text, 0));

  -- ON CONFLICT (col, ...) is parsed via the index_elem grammar, which
  -- admits expressions — so plpgsql's variable substitution applies there
  -- and collides with the `day_number` OUT parameter from RETURNS TABLE
  -- above (42702 "column reference ... is ambiguous"). Naming the
  -- constraint instead sidesteps that: it's a plain identifier lookup,
  -- not a column/expression context, so there's nothing for plpgsql to
  -- confuse with the OUT parameter of the same name. Constraint name is
  -- Postgres's default auto-generated name for the unnamed
  -- `unique (user_id, product_id, day_number)` in
  -- 20260830000100_wt_day_progress_schema.sql — confirmed against the
  -- real table via `select conname from pg_constraint where conrelid =
  -- 'wt_day_progress'::regclass and contype = 'u'`.
  insert into wt_day_progress (user_id, product_id, day_number)
  values (v_user_id, 'writing-tower', p_day_number)
  on conflict on constraint wt_day_progress_user_id_product_id_day_number_key do nothing;

  return query
    select wdp.day_number, wdp.completed_at
    from wt_day_progress wdp
    where wdp.user_id = v_user_id
      and wdp.product_id = 'writing-tower'
      and wdp.day_number = p_day_number;
end;
$$;

revoke all on function wt_complete_day(integer) from public;
revoke all on function wt_complete_day(integer) from anon;
grant execute on function wt_complete_day(integer) to authenticated;
