-- PROPOSAL — NOT APPLIED TO ANY DATABASE. Review, then apply through the
-- normal Project Skyline migration process.
--
-- Why: 20260830000200_wt_day_progress_rls_grants.sql intended "select-own-row
-- only for authenticated, nothing for anon", but it only ADDED a SELECT
-- grant. In a Supabase project, tables created by the migration role in the
-- public schema automatically receive ALL privileges for anon,
-- authenticated and service_role (ALTER DEFAULT PRIVILEGES set up by
-- Supabase). Those default grants were never revoked, so anon and
-- authenticated also hold INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES and
-- TRIGGER on wt_day_progress.
--
-- Row Level Security blocks INSERT/UPDATE/DELETE for them (there is only a
-- select-own policy), but RLS does NOT apply to TRUNCATE (nor to REFERENCES /
-- TRIGGER), so any signed-in student — or, through the public API key, any
-- anonymous caller — could empty the whole table.
--
-- Fix: remove every privilege from anon and authenticated, then give
-- authenticated back SELECT only. All writes already go through the
-- SECURITY DEFINER function wt_complete_day() (runs as the table owner), so
-- no application behaviour changes. service_role and the owner are not
-- touched. No other table, function or default privilege is touched, so
-- other Project Skyline apps are unaffected.
--
-- Safe to re-run.
begin;

revoke all on table wt_day_progress from anon;
revoke all on table wt_day_progress from authenticated;
grant select on table wt_day_progress to authenticated;

commit;

-- Verify (read-only), expecting exactly one row: authenticated | SELECT
--   select grantee, privilege_type
--   from information_schema.role_table_grants
--   where table_schema = 'public' and table_name = 'wt_day_progress'
--     and grantee in ('anon', 'authenticated');
