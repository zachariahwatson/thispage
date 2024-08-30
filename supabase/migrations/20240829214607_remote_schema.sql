drop policy "Members can create poll items" on "public"."poll_items";

drop policy "Members can create poll votes" on "public"."poll_votes";

drop policy "Members can update their own posts" on "public"."posts";

alter type "public"."club_permission" rename to "club_permission__old_version_to_be_dropped";

create type "public"."club_permission" as enum ('clubs.read', 'clubs.update', 'club_invite_codes.create', 'club_invite_codes.read', 'club_invite_codes.delete', 'members.read', 'members.delete', 'member_roles.read', 'member_roles.update', 'readings.create', 'readings.read', 'readings.read.all', 'readings.update', 'readings.delete', 'intervals.read', 'member_interval_progresses.read', 'member_interval_progresses.update.own', 'likes.create', 'likes.read', 'posts.create', 'posts.read', 'posts.update', 'posts.update.own', 'posts.delete', 'comments.create', 'comments.read', 'comments.update.own', 'comments.delete', 'likes.delete.own', 'posts.delete.own', 'comments.delete.own', 'members.delete.own', 'member_interval_progresses.delete.own', 'member_interval_progresses.create', 'likes.create.comment', 'likes.create.post', 'polls.read', 'polls.create', 'polls.delete', 'polls.update', 'poll_items.read', 'poll_items.create', 'poll_items.delete', 'poll_items.delete.own', 'poll_votes.create', 'poll_votes.delete.own', 'polls.read.all', 'poll_votes.read', 'poll_votes.update.own', 'poll_items.create.many');

alter table "public"."club_permissions" alter column permission type "public"."club_permission" using permission::text::"public"."club_permission";

drop type "public"."club_permission__old_version_to_be_dropped";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_poll_items_count(_poll_id bigint, _creator_member_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _count bigint;
BEGIN
  SELECT COUNT(*) INTO _count FROM public.poll_items WHERE poll_id = _poll_id AND creator_member_id = _creator_member_id;

  RETURN _count < 1;
END;$function$
;

CREATE OR REPLACE FUNCTION public.check_poll_votes_count(_poll_item_id bigint, _member_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    _poll_id bigint;
    _count bigint;
BEGIN
    -- Get the poll_id associated with the given poll_item_id
    SELECT poll_id INTO _poll_id
    FROM public.poll_items
    WHERE id = _poll_item_id;

    -- Count the number of votes the member has in the poll
    SELECT COUNT(*) INTO _count
    FROM public.poll_votes pv
    JOIN public.poll_items pi ON pv.poll_item_id = pi.id
    WHERE pi.poll_id = _poll_id
      AND pv.member_id = _member_id;

    -- Return true if the count is less than 1, otherwise false
    RETURN _count < 1;
END;$function$
;

CREATE OR REPLACE FUNCTION public.cls_poll_votes(_id bigint, _created_at timestamp with time zone, _member_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, created_at, member_id
    FROM public.poll_votes
    WHERE poll_votes.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      (SELECT member_id FROM original_row) IS NOT DISTINCT FROM _member_id AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  return _res;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_poll_vote()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  UPDATE poll_items
  SET votes_count = votes_count + 1
  WHERE id = NEW.poll_item_id;

  -- Increment the total_votes_count for the associated poll
  UPDATE public.polls
  SET total_votes_count = total_votes_count + 1
  WHERE id = (SELECT poll_id FROM public.poll_items WHERE id = NEW.poll_item_id);

  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_poll_vote_deletion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  UPDATE poll_items
  SET votes_count = votes_count - 1
  WHERE id = OLD.poll_item_id;

  -- Decrement the total_votes_count for the associated poll
  UPDATE public.polls
  SET total_votes_count = total_votes_count - 1
  WHERE id = (SELECT poll_id FROM public.poll_items WHERE id = OLD.poll_item_id);

  RETURN OLD;
END;$function$
;

create policy "Admins can create many poll items"
on "public"."poll_items"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), poll_id, 'poll_items.create.many'::text) AND (creator_member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), creator_member_id) AND (EXISTS ( SELECT 1
   FROM polls
  WHERE ((polls.id = poll_items.poll_id) AND (polls.is_locked = false))))));


create policy "Members can update their own poll votes"
on "public"."poll_votes"
as permissive
for update
to authenticated
using (authorize(( SELECT auth.uid() AS uid), id, 'poll_votes.update.own'::text))
with check ((user_is_member(( SELECT auth.uid() AS uid), member_id) AND cls_poll_votes(id, created_at, member_id)));


create policy "Members can create poll items"
on "public"."poll_items"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), poll_id, 'poll_items.create'::text) AND (creator_member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), creator_member_id) AND (EXISTS ( SELECT 1
   FROM polls
  WHERE ((polls.id = poll_items.poll_id) AND (polls.is_locked = false)))) AND check_poll_items_count(poll_id, creator_member_id)));


create policy "Members can create poll votes"
on "public"."poll_votes"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), poll_item_id, 'poll_votes.create'::text) AND (member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), member_id) AND check_poll_votes_count(poll_item_id, member_id)));


create policy "Members can update their own posts"
on "public"."posts"
as permissive
for update
to authenticated
using (authorize(( SELECT auth.uid() AS uid), id, 'posts.update.own'::text))
with check ((user_is_member(( SELECT auth.uid() AS uid), author_member_id) AND user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_posts_own(id, reading_id, author_member_id, likes_count, created_at)));



