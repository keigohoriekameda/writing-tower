-- Select-own-row RLS only. All writes go through the wt_complete_day()
-- SECURITY DEFINER RPC (see 20260830000300), which re-derives auth.uid()
-- and re-checks product access server-side rather than trusting the
-- client — same pattern as sjsh_stage_progress.
alter table wt_day_progress enable row level security;

create policy "wt_day_progress_select_own"
  on wt_day_progress for select
  to authenticated
  using (auth.uid() = user_id);

grant select on wt_day_progress to authenticated;
-- No insert/update/delete grant to authenticated, and nothing to anon.
