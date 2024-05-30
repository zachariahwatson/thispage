CREATE UNIQUE INDEX member_roles_member_id_key ON public.member_roles USING btree (member_id);

alter table "public"."member_roles" add constraint "member_roles_member_id_key" UNIQUE using index "member_roles_member_id_key";


