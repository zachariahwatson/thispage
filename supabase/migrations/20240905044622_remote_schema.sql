create type "public"."poll_status" as enum ('selection', 'voting', 'finished', 'archived');

drop trigger if exists "decrement_total_votes_count_upon_poll_item_deletion" on "public"."poll_items";

drop trigger if exists "decrement_votes_count_upon_vote_deletion" on "public"."poll_votes";

drop trigger if exists "increment_votes_count_upon_new_vote" on "public"."poll_votes";

drop trigger if exists "update_votes_count_upon_poll_vote_update" on "public"."poll_votes";

drop policy "Members can update their own poll votes" on "public"."poll_votes";

drop policy "Members can create poll items" on "public"."poll_items";

drop policy "Members can create poll votes" on "public"."poll_votes";

drop policy "Admins can create polls" on "public"."polls";

drop policy "Admins can update polls" on "public"."polls";

drop policy "Members can read current polls" on "public"."polls";

drop function if exists "public"."check_poll_items_count"(_poll_id bigint, _creator_member_id bigint);

drop function if exists "public"."check_poll_votes_count"(_poll_item_id bigint, _member_id bigint);

drop function if exists "public"."cls_poll_votes"(_id bigint, _created_at timestamp with time zone, _member_id bigint);

drop function if exists "public"."cls_polls"(_id bigint, _created_at timestamp with time zone, _club_id bigint, _end_date timestamp with time zone, _creator_member_id bigint, _is_finished boolean);

drop function if exists "public"."handle_new_poll_vote"();

drop function if exists "public"."handle_poll_vote_deletion"();

drop function if exists "public"."handle_poll_vote_update"();

drop view if exists "public"."spreads_count_view";

alter table "public"."poll_items" drop column "votes_count";

alter table "public"."polls" drop column "is_finished";

alter table "public"."polls" drop column "total_votes_count";

alter table "public"."polls" add column "status" poll_status not null default 'selection'::poll_status;

alter table "public"."polls" add column "voting_length_days" bigint not null default '7'::bigint;

alter table "public"."polls" alter column "end_date" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cls_polls(_id bigint, _created_at timestamp with time zone, _club_id bigint, _end_date timestamp with time zone, _creator_member_id bigint, _voting_length_days bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, created_at, club_id, end_date, creator_member_id, voting_length_days
    FROM public.polls
    WHERE polls.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      (SELECT club_id FROM original_row) IS NOT DISTINCT FROM _club_id AND
      (SELECT end_date FROM original_row) IS NOT DISTINCT FROM _end_date AND
      (SELECT creator_member_id FROM original_row) IS NOT DISTINCT FROM _creator_member_id AND
      (SELECT voting_length_days FROM original_row) IS NOT DISTINCT FROM _voting_length_days AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  return _res;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_poll_item()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
if (select status from polls where id = new.poll_id) != 'selection' then
    raise exception 'member % tried to insert a poll item in poll % when the poll was not in the selection phase', new.creator_member_id, new.poll_id;
  end if;
  return new;
END;$function$
;

create or replace view "public"."poll_items_with_votes" as  SELECT pi.id,
    pi.poll_id,
    pi.created_at,
    pi.book_title,
    pi.book_description,
    pi.book_authors,
    pi.book_open_library_id,
    pi.book_cover_image_url,
    pi.creator_member_id,
    pi.book_page_count,
    pi.book_cover_image_width,
    pi.book_cover_image_height,
    count(pv.poll_item_id) AS votes_count
   FROM (poll_items pi
     LEFT JOIN poll_votes pv ON ((pi.id = pv.poll_item_id)))
  GROUP BY pi.id;


CREATE OR REPLACE FUNCTION public.handle_poll_item_deletion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
if (select status from polls where id = old.poll_id) != 'selection' then
    raise exception 'member % tried to delete a poll item in poll % when the poll was not in the selection phase', old.creator_member_id, old.poll_id;
  end if;
  return old;
END;$function$
;

create or replace view "public"."spreads_count_view" as  SELECT clubs.id AS club_id,
    count(DISTINCT readings.id) AS total_readings,
    count(DISTINCT polls.id) AS total_polls,
    (count(DISTINCT readings.id) + count(DISTINCT polls.id)) AS total_spreads
   FROM ((clubs
     LEFT JOIN readings ON (((readings.club_id = clubs.id) AND (readings.is_archived = false))))
     LEFT JOIN polls ON (((polls.club_id = clubs.id) AND (polls.status <> 'archived'::poll_status))))
  GROUP BY clubs.id;


create policy "Members can create poll items"
on "public"."poll_items"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), poll_id, 'poll_items.create'::text) AND (creator_member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), creator_member_id) AND (EXISTS ( SELECT 1
   FROM polls
  WHERE ((polls.id = poll_items.poll_id) AND (polls.is_locked = false))))));


create policy "Members can create poll votes"
on "public"."poll_votes"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), poll_item_id, 'poll_votes.create'::text) AND (member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), member_id)));


create policy "Admins can create polls"
on "public"."polls"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), club_id, 'polls.create'::text) AND (creator_member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), creator_member_id) AND (status = 'selection'::poll_status)));


create policy "Admins can update polls"
on "public"."polls"
as permissive
for update
to authenticated
using (authorize(( SELECT auth.uid() AS uid), id, 'polls.update'::text))
with check ((user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_polls(id, created_at, club_id, end_date, creator_member_id, voting_length_days)));


create policy "Members can read current polls"
on "public"."polls"
as permissive
for select
to authenticated
using ((authorize(( SELECT auth.uid() AS uid), id, 'polls.read'::text) AND (status <> 'archived'::poll_status)));


CREATE TRIGGER check_poll_status_upon_new_poll_item BEFORE INSERT ON public.poll_items FOR EACH ROW EXECUTE FUNCTION handle_new_poll_item();

CREATE TRIGGER check_poll_status_upon_poll_item_deletion BEFORE DELETE ON public.poll_items FOR EACH ROW EXECUTE FUNCTION handle_poll_item_deletion();


