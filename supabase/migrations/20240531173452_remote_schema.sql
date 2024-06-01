drop policy "Members can create progresses" on "public"."member_interval_progresses";

create policy "Members can create progresses"
on "public"."member_interval_progresses"
as permissive
for insert
to authenticated
with check (user_is_member(( SELECT auth.uid() AS uid), member_id));



