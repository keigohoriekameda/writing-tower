-- PROPOSAL — NOT APPLIED. Idempotent safety net for databases where
-- 20260901000100_wt_feedback_quota.sql was applied BEFORE it gained its
-- own revokes (commit d8fe519).
--
-- Supabase default privileges give anon/authenticated ALL privileges on new
-- public tables and USAGE/UPDATE on their sequences. RLS does not cover
-- TRUNCATE, so without these revokes any caller could empty
-- wt_feedback_usage and reset every student's usage counter. The
-- SECURITY DEFINER function wt_consume_feedback_quota() runs as the owner
-- and needs none of these privileges. service_role is not touched.
--
-- No effect (and safe to re-run) if the revokes are already in place.
begin;
revoke all on table wt_feedback_usage from anon, authenticated;
revoke all on sequence wt_feedback_usage_id_seq from anon, authenticated;
commit;

-- Verify (read-only), expecting zero rows:
--   select grantee, privilege_type from information_schema.role_table_grants
--   where table_schema = 'public' and table_name = 'wt_feedback_usage'
--     and grantee in ('anon', 'authenticated');
