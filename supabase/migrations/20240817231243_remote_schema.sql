set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cls_comments(_id bigint, _author_member_id bigint, _post_id bigint, _likes_count bigint, _created_at timestamp with time zone, _root_comment_id bigint, _replying_to_comment_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, author_member_id, post_id, likes_count, created_at, root_comment_id, replying_to_comment_id
    FROM public.comments
    WHERE comments.id = _id
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


