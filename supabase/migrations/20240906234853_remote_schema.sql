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


drop policy "Members can create poll items" on "public"."poll_items";

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

CREATE OR REPLACE FUNCTION public.set_poll_end_date()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  RAISE LOG 'old status: %, new status: %', old.status, new.status;
  IF old.status = 'selection' AND new.status = 'voting' THEN
    UPDATE public.polls SET end_date = now() + (new.voting_length_days * INTERVAL '1 day') WHERE polls.id = new.id;
  END IF;
  return new;
END;$function$
;

create policy "Members can create poll items"
on "public"."poll_items"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), poll_id, 'poll_items.create'::text) AND (creator_member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), creator_member_id) AND (EXISTS ( SELECT 1
   FROM polls
  WHERE ((polls.id = poll_items.poll_id) AND (polls.is_locked = false)))) AND check_poll_items_count(id, creator_member_id)));



