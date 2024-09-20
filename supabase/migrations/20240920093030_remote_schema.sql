set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.check_polls_end_dates()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Select polls where end_date is between 1 and 2 hours from now
    WITH selected_polls AS (
        SELECT *
        FROM public.polls
        WHERE status != 'archived'::poll_status AND
        end_date IS NOT NULL
        AND end_date BETWEEN now() + interval '1 hour' AND now() + interval '2 hours'
    )
    -- Send individual HTTP requests for each row in the selected polls
    SELECT net.http_post (
        'https://iaxtcyyckbzhhbeofyco.supabase.co/functions/v1/send-poll-ending-notification',
        to_jsonb(selected_polls.*),
        headers:='{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheHRjeXlja2J6aGhiZW9meWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY1ODQ4NjQsImV4cCI6MjAzMjE2MDg2NH0.-bPxpOF0nYuSup4lFUMpIT_7LzEFeVk6wedkig3bDgg"}'::jsonb
    ) AS request_id FROM selected_polls;
END;$function$
;

CREATE OR REPLACE FUNCTION private.update_polls_is_finished()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  -- Step 1: Select the polls that need to be updated
  WITH selected_polls AS (
    SELECT *
    FROM public.polls
    WHERE status != 'archived'::poll_status AND
    end_date IS NOT NULL AND end_date <= now()
    FOR UPDATE -- Lock the selected rows for the update
  )
  
  -- Step 2: Update the status of the selected polls
  UPDATE public.polls
  SET status = 'finished'::poll_status
  WHERE id IN (SELECT id FROM selected_polls);
  
  -- Step 3: Send individual HTTP requests for each row in the selected polls
  SELECT net.http_post (
      'https://iaxtcyyckbzhhbeofyco.supabase.co/functions/v1/send-poll-finished-notification',
      to_jsonb(selected_polls.*),
      headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheHRjeXlja2J6aGhiZW9meWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY1ODQ4NjQsImV4cCI6MjAzMjE2MDg2NH0.-bPxpOF0nYuSup4lFUMpIT_7LzEFeVk6wedkig3bDgg"}'::jsonb
  ) AS request_id 
  FROM selected_polls;
END;$function$
;


