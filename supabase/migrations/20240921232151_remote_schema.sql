set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.check_polls_end_dates()
 RETURNS TABLE(request_id bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    secret text;  -- Variable to hold the decrypted secret
BEGIN
    -- Fetch the decrypted service role key from the vault
    SELECT decrypted_secret INTO secret
    FROM vault.decrypted_secrets
    WHERE name = 'service_role_key';

    RETURN QUERY
    -- Select polls where end_date is between 1 and 2 hours from now
    WITH selected_polls AS (
        SELECT *
        FROM public.polls
        WHERE status = 'voting'::poll_status
        AND end_date IS NOT NULL
        AND end_date BETWEEN now() + interval '1 hour' AND now() + interval '2 hours'
    )

    -- Return request_id for each HTTP POST request
    SELECT net.http_post(
        'https://iaxtcyyckbzhhbeofyco.supabase.co/functions/v1/send-poll-ending-notification',
        to_jsonb(selected_polls.*),
        headers := jsonb_build_object('Authorization', 'Bearer ' || secret)
    ) AS request_id
    FROM selected_polls;
END;$function$
;

CREATE OR REPLACE FUNCTION private.update_polls_is_finished()
 RETURNS TABLE(request_id bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    secret text;  -- Variable to hold the decrypted secret
BEGIN
    -- Fetch the decrypted service role key from the vault
    SELECT decrypted_secret INTO secret
    FROM vault.decrypted_secrets
    WHERE name = 'service_role_key';

    RETURN QUERY
        -- Step 1: Select the polls that need to be updated
  WITH selected_polls AS (
    SELECT *
    FROM public.polls
    WHERE status = 'voting'::poll_status AND
    end_date IS NOT NULL AND 
    end_date <= now()
    FOR UPDATE -- Lock the selected rows for the update
  )
  
  -- Step 2: Update the status of the selected polls
  UPDATE public.polls
  SET status = 'finished'::poll_status
  WHERE id IN (SELECT id FROM selected_polls);

    -- Return request_id for each HTTP POST request
    SELECT net.http_post(
        'https://iaxtcyyckbzhhbeofyco.supabase.co/functions/v1/send-poll-finished-notification',
        to_jsonb(selected_polls.*),
        headers := jsonb_build_object('Authorization', 'Bearer ' || secret)
    ) AS request_id
    FROM selected_polls;
END;$function$
;


