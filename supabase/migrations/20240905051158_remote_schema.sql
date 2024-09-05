create extension if not exists "hypopg" with schema "extensions";

create extension if not exists "index_advisor" with schema "extensions";


drop view if exists "public"."spreads_count_view";

alter table "public"."polls" drop column "is_archived";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_poll_vote()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _poll_id bigint;
BEGIN
-- Get the poll_id associated with the given poll_item_id
  SELECT poll_id INTO _poll_id
  FROM public.poll_items
  WHERE id = new.poll_item_id;

if (select status from polls where id = _poll_id) != 'voting' then
    raise exception 'member % tried to insert a poll vote in poll % when the poll was not in the voting phase', new.member_id, _poll_id;
  end if;
  return new;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_poll_vote_deletion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _poll_id bigint;
BEGIN
-- Get the poll_id associated with the given poll_item_id
  SELECT poll_id INTO _poll_id
  FROM public.poll_items
  WHERE id = old.poll_item_id;

if (select status from polls where id = _poll_id) != 'voting' then
    raise exception 'member % tried to delete a poll vote in poll % when the poll was not in the voting phase', old.member_id, _poll_id;
  end if;
  return old;
END;$function$
;

CREATE OR REPLACE FUNCTION public.set_poll_end_date()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  IF old.status = 'selection'::poll_status AND new.status = 'voting'::poll_status THEN
    new.end_date := now() + (new.voting_length_days * INTERVAL '1 day');
  END IF;
  return new;
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


CREATE TRIGGER check_poll_status_upon_new_vote BEFORE INSERT ON public.poll_votes FOR EACH ROW EXECUTE FUNCTION handle_new_poll_vote();

CREATE TRIGGER check_poll_status_upon_vote_deletion BEFORE DELETE ON public.poll_votes FOR EACH ROW EXECUTE FUNCTION handle_poll_vote_deletion();

CREATE TRIGGER set_poll_end_date_upon_voting_status AFTER UPDATE ON public.polls FOR EACH ROW EXECUTE FUNCTION set_poll_end_date();


