alter table "public"."members" add column "used_club_invite_code_id" bigint;

alter table "public"."members" add constraint "members_used_club_invite_code_id_fkey" FOREIGN KEY (used_club_invite_code_id) REFERENCES club_invite_codes(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."members" validate constraint "members_used_club_invite_code_id_fkey";


