set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.update_polls_is_finished()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  UPDATE public.polls
  SET status = 'finished'::poll_status
  WHERE end_date IS NOT NULL AND end_date <= now();
END;$function$
;


alter type "public"."club_permission" rename to "club_permission__old_version_to_be_dropped";

create type "public"."club_permission" as enum ('clubs.read', 'clubs.update', 'club_invite_codes.create', 'club_invite_codes.read', 'club_invite_codes.delete', 'members.read', 'members.delete', 'member_roles.read', 'member_roles.update', 'readings.create', 'readings.read', 'readings.read.all', 'readings.update', 'readings.delete', 'intervals.read', 'member_interval_progresses.read', 'member_interval_progresses.update.own', 'likes.create', 'likes.read', 'posts.create', 'posts.read', 'posts.update', 'posts.update.own', 'posts.delete', 'comments.create', 'comments.read', 'comments.update.own', 'comments.delete', 'likes.delete.own', 'posts.delete.own', 'comments.delete.own', 'members.delete.own', 'member_interval_progresses.delete.own', 'member_interval_progresses.create', 'likes.create.comment', 'likes.create.post', 'polls.read', 'polls.create', 'polls.delete', 'polls.update', 'poll_items.read', 'poll_items.create', 'poll_items.delete', 'poll_items.delete.own', 'poll_votes.create', 'poll_votes.delete.own', 'polls.read.all', 'poll_votes.read', 'poll_votes.update.own', 'poll_items.create.many', 'members.update.own');

alter table "public"."club_permissions" alter column permission type "public"."club_permission" using permission::text::"public"."club_permission";

drop type "public"."club_permission__old_version_to_be_dropped";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cls_members(_id bigint, _user_id uuid, _club_id bigint, _created_at timestamp with time zone, _used_club_invite_code uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, user_id, club_id, created_at, used_club_invite_code
    FROM public.members
    WHERE members.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT user_id FROM original_row) IS NOT DISTINCT FROM _user_id AND
      (SELECT club_id FROM original_row) IS NOT DISTINCT FROM _club_id AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      (SELECT used_club_invite_code FROM original_row) IS NOT DISTINCT FROM _used_club_invite_code AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  return _res;
END;$function$
;

create policy "Members can update is_favorite"
on "public"."members"
as permissive
for update
to authenticated
using (authorize(( SELECT auth.uid() AS uid), id, 'members.update.own'::text))
with check (((user_id = ( SELECT auth.uid() AS uid)) AND user_is_member(( SELECT auth.uid() AS uid), id) AND cls_members(id, user_id, club_id, created_at, used_club_invite_code)));



