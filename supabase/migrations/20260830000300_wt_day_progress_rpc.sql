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
grant execute on function wt_check_product_access(uuid) to authenticated;

-- Idempotently marks `p_day` complete for the calling user. Re-derives
-- auth.uid() itself (never trusts a client-supplied user id), re-checks
-- product access, and takes an advisory lock keyed on (user, day) so
-- concurrent duplicate submissions can't race each other.
create or replace function wt_complete_day(p_day integer)
returns table (day integer, completed_at timestamptz)
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

  if p_day is null or p_day < 1 then
    raise exception 'invalid day: %', p_day;
  end if;

  if not wt_check_product_access(v_user_id) then
    raise exception 'no active product access for writing-tower';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || ':day:' || p_day::text, 0));

  insert into wt_day_progress (user_id, product_id, day)
  values (v_user_id, 'writing-tower', p_day)
  on conflict (user_id, product_id, day) do nothing;

  return query
    select wdp.day, wdp.completed_at
    from wt_day_progress wdp
    where wdp.user_id = v_user_id
      and wdp.product_id = 'writing-tower'
      and wdp.day = p_day;
end;
$$;

revoke all on function wt_complete_day(integer) from public;
grant execute on function wt_complete_day(integer) to authenticated;
