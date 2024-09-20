set check_function_bodies = off;

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


create or replace view "public"."post_metadata_view" as  SELECT p.id AS post_id,
    r.book_title,
    r.book_authors,
    c.name AS club_name,
    r.book_cover_image_url,
    r.book_cover_image_width,
    r.book_cover_image_height,
        CASE
            WHEN p.is_spoiler THEN 'a post (spoiler!)'::text
            ELSE p.title
        END AS post_title
   FROM ((posts p
     JOIN readings r ON ((p.reading_id = r.id)))
     JOIN clubs c ON ((r.club_id = c.id)));



