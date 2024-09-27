set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.update_polls_is_finished()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  UPDATE public.polls
  SET status = 'finished'::poll_status
  WHERE status = 'voting'::poll_status
  AND end_date IS NOT NULL 
  AND end_date <= now();
END;$function$
;


