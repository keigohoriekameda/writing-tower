-- PROPOSAL — NOT APPLIED TO ANY DATABASE. Review, then apply through the
-- normal Project Skyline migration process.
--
-- Server-side usage limits for the Writing Tower AI feedback endpoint
-- (app/api/feedback). Limits are enforced per authenticated student in the
-- database, so they hold across browsers, devices and serverless instances
-- (a browser-side or per-instance counter can be bypassed trivially).
--
-- Until this migration is applied the API falls back to a per-instance,
-- in-memory limiter (lib/feedback/quota.ts) and logs a warning.
--
-- Limits (keep in sync with QUOTA in lib/feedback/quota.ts):
--   * at most 1 request / 5 seconds
--   * at most 20 requests / hour
--   * at most 60 requests / day
-- An attempt counts when it is accepted, whether or not the AI call later
-- succeeds, because the cost is incurred either way.

create table if not exists wt_feedback_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists wt_feedback_usage_user_created_idx
  on wt_feedback_usage (user_id, created_at desc);

-- No policies and no grants: rows are only written by the RPC below.
alter table wt_feedback_usage enable row level security;

create or replace function wt_consume_feedback_quota()
returns table (allowed boolean, reason text, retry_after_seconds integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_last timestamptz;
  v_hour_count integer;
  v_hour_oldest timestamptz;
  v_day_count integer;
  v_day_oldest timestamptz;
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  if not wt_check_product_access(v_user_id) then
    raise exception 'no active product access for writing-tower';
  end if;

  -- Serialise concurrent requests from the same student so two parallel
  -- submissions can't both slip under the limit.
  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || ':feedback-quota', 0));

  select max(created_at) into v_last
    from wt_feedback_usage where user_id = v_user_id;

  if v_last is not null and v_last > now() - interval '5 seconds' then
    return query select false, 'too_fast'::text,
      greatest(1, ceil(extract(epoch from (v_last + interval '5 seconds' - now())))::integer);
    return;
  end if;

  select count(*), min(created_at) into v_hour_count, v_hour_oldest
    from wt_feedback_usage
    where user_id = v_user_id and created_at > now() - interval '1 hour';

  if v_hour_count >= 20 then
    return query select false, 'hourly'::text,
      greatest(1, ceil(extract(epoch from (v_hour_oldest + interval '1 hour' - now())))::integer);
    return;
  end if;

  select count(*), min(created_at) into v_day_count, v_day_oldest
    from wt_feedback_usage
    where user_id = v_user_id and created_at > now() - interval '1 day';

  if v_day_count >= 60 then
    return query select false, 'daily'::text,
      greatest(1, ceil(extract(epoch from (v_day_oldest + interval '1 day' - now())))::integer);
    return;
  end if;

  insert into wt_feedback_usage (user_id) values (v_user_id);

  -- Housekeeping limited to this new log table: drop this student's usage
  -- rows older than 7 days. Never touches wt_day_progress or any other data.
  delete from wt_feedback_usage
    where user_id = v_user_id and created_at < now() - interval '7 days';

  return query select true, null::text, 0;
end;
$$;

revoke all on function wt_consume_feedback_quota() from public;
revoke all on function wt_consume_feedback_quota() from anon;
grant execute on function wt_consume_feedback_quota() to authenticated;

-- FOLLOW-UP (deliberately not in this migration; needs a design decision):
-- wt_complete_day() currently trusts the client to call it only after a
-- successful review. Binding completion to a server-recorded successful
-- feedback (e.g. a wt_feedback_usage.succeeded_day column that
-- wt_complete_day checks) would make "Day completed" tamper-proof, but it
-- changes the completion contract for existing students' local-cache sync.
