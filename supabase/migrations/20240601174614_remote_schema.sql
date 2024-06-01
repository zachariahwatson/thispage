drop policy "Users can create memberships from codes" on "public"."members";

create policy "Users can create memberships from codes"
on "public"."members"
as permissive
for insert
to authenticated
with check (((user_id = ( SELECT auth.uid() AS uid)) AND (club_id = ( SELECT club_invite_codes.club_id
   FROM club_invite_codes
  WHERE (club_invite_codes.code = members.used_club_invite_code))) AND (NOT (EXISTS ( SELECT 1
   FROM members m
  WHERE ((m.club_id = members.club_id) AND (m.user_id = ( SELECT auth.uid() AS uid))))))));



