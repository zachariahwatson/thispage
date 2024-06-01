alter type "public"."club_permission" rename to "club_permission__old_version_to_be_dropped";

create type "public"."club_permission" as enum ('clubs.read', 'clubs.update', 'club_invite_codes.create', 'club_invite_codes.read', 'club_invite_codes.delete', 'members.read', 'members.delete', 'member_roles.read', 'member_roles.update', 'readings.create', 'readings.read', 'readings.read.all', 'readings.update', 'readings.delete', 'intervals.read', 'member_interval_progresses.read', 'member_interval_progresses.update.own', 'likes.create', 'likes.read', 'posts.create', 'posts.read', 'posts.update', 'posts.update.own', 'posts.delete', 'comments.create', 'comments.read', 'comments.update.own', 'comments.delete', 'likes.delete.own', 'posts.delete.own', 'comments.delete.own', 'members.delete.own', 'member_interval_progresses.delete.own', 'member_interval_progresses.create');

alter table "public"."club_permissions" alter column permission type "public"."club_permission" using permission::text::"public"."club_permission";

drop type "public"."club_permission__old_version_to_be_dropped";

create policy "Members can create progresses"
on "public"."member_interval_progresses"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), id, 'member_interval_progresses.create'::text) AND user_is_member(( SELECT auth.uid() AS uid), member_id) AND (NOT (EXISTS ( SELECT 1
   FROM member_interval_progresses mp
  WHERE ((mp.member_id = member_interval_progresses.member_id) AND (mp.interval_id = member_interval_progresses.interval_id)))))));



