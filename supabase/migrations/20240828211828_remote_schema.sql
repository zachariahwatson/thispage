set check_function_bodies = off;

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


