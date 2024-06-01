set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cls_clubs(_id bigint, _created_at timestamp with time zone, _creator_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, created_at, creator_user_id
    FROM public.clubs
    WHERE clubs.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      (SELECT creator_user_id FROM original_row) IS NOT DISTINCT FROM _creator_user_id AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  return _res;
END;$function$
;

CREATE OR REPLACE FUNCTION public.cls_comments(_id bigint, _author_member_id bigint, _post_id bigint, _likes_count bigint, _created_at timestamp with time zone, _root_comment_id bigint, _replying_to_comment_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, author_member_id, post_id, likes_count, created_at, root_comment_id, replying_to_comment_id
    FROM public.posts
    WHERE posts.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT author_member_id FROM original_row) IS NOT DISTINCT FROM _author_member_id AND
      (SELECT post_id FROM original_row) IS NOT DISTINCT FROM _post_id AND
      (SELECT likes_count FROM original_row) IS NOT DISTINCT FROM _likes_count AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      (SELECT root_comment_id FROM original_row) IS NOT DISTINCT FROM _root_comment_id AND
      (SELECT replying_to_comment_id FROM original_row) IS NOT DISTINCT FROM _replying_to_comment_id AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$function$
;

CREATE OR REPLACE FUNCTION public.cls_member_interval_progresses(_id bigint, _member_id bigint, _interval_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, member_id, interval_id
    FROM public.member_interval_progresses
    WHERE member_interval_progresses.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT member_id FROM original_row) IS NOT DISTINCT FROM _member_id AND
      (SELECT interval_id FROM original_row) IS NOT DISTINCT FROM _interval_id AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$function$
;

CREATE OR REPLACE FUNCTION public.cls_member_roles(_id bigint, _member_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, member_id
    FROM public.member_roles
    WHERE member_roles.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT member_id FROM original_row) IS NOT DISTINCT FROM _member_id AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$function$
;

CREATE OR REPLACE FUNCTION public.cls_posts_others(_id bigint, _reading_id bigint, _author_member_id bigint, _title text, _content text, _likes_count bigint, _created_at timestamp with time zone)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, reading_id, author_member_id, title, content, likes_count, created_at
    FROM public.posts
    WHERE posts.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT reading_id FROM original_row) IS NOT DISTINCT FROM _reading_id AND
      (SELECT author_member_id FROM original_row) IS NOT DISTINCT FROM _author_member_id AND
      (SELECT title FROM original_row) IS NOT DISTINCT FROM _title AND
      (SELECT content FROM original_row) IS NOT DISTINCT FROM _content AND
      (SELECT likes_count FROM original_row) IS NOT DISTINCT FROM _likes_count AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$function$
;

CREATE OR REPLACE FUNCTION public.cls_posts_own(_id bigint, _reading_id bigint, _author_member_id bigint, _likes_count bigint, _created_at timestamp with time zone)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, reading_id, author_member_id, likes_count, created_at
    FROM public.posts
    WHERE posts.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT reading_id FROM original_row) IS NOT DISTINCT FROM _reading_id AND
      (SELECT author_member_id FROM original_row) IS NOT DISTINCT FROM _author_member_id AND
      (SELECT likes_count FROM original_row) IS NOT DISTINCT FROM _likes_count AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$function$
;

CREATE OR REPLACE FUNCTION public.cls_readings(_id bigint, _club_id bigint, _book_id bigint, _start_date timestamp with time zone, _is_finished boolean, _created_at timestamp with time zone, _creator_member_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, club_id, book_id, start_date, is_finished, created_at, creator_member_id
    FROM public.readings
    WHERE readings.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT club_id FROM original_row) IS NOT DISTINCT FROM _club_id AND
      (SELECT book_id FROM original_row) IS NOT DISTINCT FROM _book_id AND
      (SELECT start_date FROM original_row) IS NOT DISTINCT FROM _start_date AND
      (SELECT is_finished FROM original_row) IS NOT DISTINCT FROM _is_finished AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      (SELECT creator_member_id FROM original_row) IS NOT DISTINCT FROM _creator_member_id AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$function$
;


