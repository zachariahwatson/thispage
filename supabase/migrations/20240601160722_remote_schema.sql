alter table "public"."members" drop constraint "members_used_club_invite_code_id_fkey";

alter table "public"."members" drop column "used_club_invite_code_id";

alter table "public"."members" add column "used_club_invite_code" uuid;

alter table "public"."members" add constraint "members_used_club_invite_code_fkey" FOREIGN KEY (used_club_invite_code) REFERENCES club_invite_codes(code) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."members" validate constraint "members_used_club_invite_code_fkey";

create policy "Users can create memberships from codes"
on "public"."members"
as permissive
for insert
to authenticated
with check (((user_id = ( SELECT auth.uid() AS uid)) AND (club_id = ( SELECT club_invite_codes.club_id
   FROM club_invite_codes
  WHERE (club_invite_codes.code = members.used_club_invite_code))) AND (NOT (EXISTS ( SELECT 1
   FROM members members_1
  WHERE ((members_1.club_id = members.club_id) AND (members_1.user_id = ( SELECT auth.uid() AS uid))))))));



