drop policy "Members can read invite codes" on "public"."club_invite_codes";

create policy "Enable read access for authenticated users"
on "public"."club_invite_codes"
as permissive
for select
to authenticated
using (true);



