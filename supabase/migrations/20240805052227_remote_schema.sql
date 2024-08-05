set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cls_readings(_id bigint, _club_id bigint, _start_date timestamp with time zone, _is_finished boolean, _book_open_library_id text, _book_title text, _book_description text, _book_authors text[], _book_page_count bigint, _book_cover_image_url text, _book_cover_image_width bigint, _book_cover_image_height bigint, _created_at timestamp with time zone, _creator_member_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, club_id, start_date, is_finished, book_open_library_id, book_title, book_description, book_authors, book_page_count, book_cover_image_url, book_cover_image_width, book_cover_image_height, created_at, creator_member_id
    FROM public.readings
    WHERE readings.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT club_id FROM original_row) IS NOT DISTINCT FROM _club_id AND
      (SELECT book_id FROM original_row) IS NOT DISTINCT FROM _book_id AND
      (SELECT start_date FROM original_row) IS NOT DISTINCT FROM _start_date AND
      (SELECT is_finished FROM original_row) IS NOT DISTINCT FROM _is_finished AND
      (SELECT book_open_library_id FROM original_row) IS NOT DISTINCT FROM _book_open_library_id AND
      (SELECT book_title FROM original_row) IS NOT DISTINCT FROM _book_title AND
      (SELECT book_description FROM original_row) IS NOT DISTINCT FROM _book_description AND
      (SELECT book_authors FROM original_row) IS NOT DISTINCT FROM _book_authors AND
      (SELECT book_page_count FROM original_row) IS NOT DISTINCT FROM _book_page_count AND
      (SELECT book_cover_image_url FROM original_row) IS NOT DISTINCT FROM _book_cover_image_url AND
      (SELECT book_cover_image_width FROM original_row) IS NOT DISTINCT FROM _book_cover_image_width AND
      (SELECT book_cover_image_height FROM original_row) IS NOT DISTINCT FROM _book_cover_image_height AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      (SELECT creator_member_id FROM original_row) IS NOT DISTINCT FROM _creator_member_id AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$function$
;


