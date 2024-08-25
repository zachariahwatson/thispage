drop policy "Admins can update readings" on "public"."readings";

set check_function_bodies = off;

CREATE FUNCTION public.cls_readings(_id bigint, _club_id bigint, _start_date timestamp with time zone, _is_finished boolean, _book_open_library_id text, _book_title text, _book_description text, _book_authors text[], _book_page_count bigint, _created_at timestamp with time zone, _creator_member_id bigint, _increment_type reading_increment)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, club_id, start_date, is_finished, book_open_library_id, book_title, book_description, book_authors, book_page_count, created_at, creator_member_id, increment_type
    FROM public.readings
    WHERE readings.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT club_id FROM original_row) IS NOT DISTINCT FROM _club_id AND
      (SELECT start_date FROM original_row) IS NOT DISTINCT FROM _start_date AND
      (SELECT is_finished FROM original_row) IS NOT DISTINCT FROM _is_finished AND
      (SELECT book_open_library_id FROM original_row) IS NOT DISTINCT FROM _book_open_library_id AND
      (SELECT book_title FROM original_row) IS NOT DISTINCT FROM _book_title AND
      (SELECT book_description FROM original_row) IS NOT DISTINCT FROM _book_description AND
      (SELECT book_authors FROM original_row) IS NOT DISTINCT FROM _book_authors AND
      (SELECT book_page_count FROM original_row) IS NOT DISTINCT FROM _book_page_count AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      (SELECT creator_member_id FROM original_row) IS NOT DISTINCT FROM _creator_member_id AND
      (SELECT increment_type FROM original_row) IS NOT DISTINCT FROM _increment_type AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$function$
;

create policy "Admins can update readings"
on "public"."readings"
as permissive
for update
to authenticated
using (authorize(( SELECT auth.uid() AS uid), id, 'readings.update'::text))
with check ((user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_readings(id, club_id, start_date, is_finished, book_open_library_id, book_title, book_description, book_authors, book_page_count, created_at, creator_member_id, increment_type)));



