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
    
    IF _count >= 1 THEN
      RAISE EXCEPTION 'member % exceeded max votes count in poll %', _member_id, _poll_id 
      USING ERRCODE = 'P0003';
    END IF;

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

CREATE OR REPLACE FUNCTION public.handle_poll_item_deletion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  UPDATE polls
  SET total_votes_count = total_votes_count - OLD.votes_count
  WHERE id = OLD.poll_id;

  RETURN OLD;
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

CREATE OR REPLACE FUNCTION public.handle_poll_vote_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  UPDATE poll_items
  SET votes_count = votes_count + 1
  WHERE id = NEW.poll_item_id;

  UPDATE poll_items
  SET votes_count = votes_count - 1
  WHERE id = OLD.poll_item_id;

  RETURN NEW;
END;$function$
;


