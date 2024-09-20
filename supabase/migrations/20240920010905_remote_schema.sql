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
        WHERE end_date IS NOT NULL
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


create or replace view "public"."members_without_poll_votes" as  SELECT DISTINCT m.id AS member_id,
    m.user_id,
    pi.poll_id
   FROM ((members m
     JOIN poll_items pi ON ((m.club_id = ( SELECT polls.club_id
           FROM polls
          WHERE (polls.id = pi.poll_id)))))
     LEFT JOIN poll_votes pv ON (((m.id = pv.member_id) AND (pv.poll_item_id IN ( SELECT poll_items.id
           FROM poll_items
          WHERE (poll_items.poll_id = pi.poll_id))))))
  WHERE (pv.id IS NULL);



