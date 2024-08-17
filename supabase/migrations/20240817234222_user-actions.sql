drop policy "Admins can update clubs" on "public"."clubs";

drop policy "Members can update their own comments" on "public"."comments";

drop policy "Members can update their own progresses" on "public"."member_interval_progresses";

drop policy "Admins can update member roles" on "public"."member_roles";

drop policy "Moderators can update posts" on "public"."posts";

drop policy "Admins can update readings" on "public"."readings";

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

CREATE OR REPLACE FUNCTION public.user_is_member(_user_id uuid, _member_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  return exists (select 1 from public.members where members.user_id = _user_id and members.id = _member_id);
end;$function$
;

create policy "Admins can update clubs"
on "public"."clubs"
as permissive
for update
to authenticated
using ((authorize(( SELECT auth.uid() AS uid), id, 'clubs.update'::text) AND user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_clubs(id, created_at, creator_user_id)))
with check ((authorize(( SELECT auth.uid() AS uid), id, 'clubs.update'::text) AND user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_clubs(id, created_at, creator_user_id)));


create policy "Members can update their own comments"
on "public"."comments"
as permissive
for update
to authenticated
using ((authorize(( SELECT auth.uid() AS uid), id, 'comments.update.own'::text) AND user_is_member(( SELECT auth.uid() AS uid), author_member_id) AND cls_comments(id, author_member_id, post_id, likes_count, created_at, root_comment_id, replying_to_comment_id)))
with check ((authorize(( SELECT auth.uid() AS uid), id, 'comments.update.own'::text) AND user_is_member(( SELECT auth.uid() AS uid), author_member_id) AND cls_comments(id, author_member_id, post_id, likes_count, created_at, root_comment_id, replying_to_comment_id)));


create policy "Members can update their own progresses"
on "public"."member_interval_progresses"
as permissive
for update
to authenticated
using ((authorize(( SELECT auth.uid() AS uid), id, 'member_interval_progresses.update.own'::text) AND user_is_member(( SELECT auth.uid() AS uid), member_id) AND cls_member_interval_progresses(id, member_id, interval_id)))
with check ((authorize(( SELECT auth.uid() AS uid), id, 'member_interval_progresses.update.own'::text) AND user_is_member(( SELECT auth.uid() AS uid), member_id) AND cls_member_interval_progresses(id, member_id, interval_id)));


create policy "Admins can update member roles"
on "public"."member_roles"
as permissive
for update
to authenticated
using ((authorize(( SELECT auth.uid() AS uid), id, 'member_roles.update'::text) AND user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_member_roles(id, member_id)))
with check ((authorize(( SELECT auth.uid() AS uid), id, 'member_roles.update'::text) AND user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_member_roles(id, member_id)));


create policy "Moderators can update posts"
on "public"."posts"
as permissive
for update
to authenticated
using ((authorize(( SELECT auth.uid() AS uid), id, 'posts.update'::text) AND user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_posts_others(id, reading_id, author_member_id, title, content, likes_count, created_at)))
with check ((authorize(( SELECT auth.uid() AS uid), id, 'posts.update'::text) AND user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_posts_others(id, reading_id, author_member_id, title, content, likes_count, created_at)));


create policy "Admins can update readings"
on "public"."readings"
as permissive
for update
to authenticated
using ((authorize(( SELECT auth.uid() AS uid), id, 'readings.update'::text) AND user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_readings(id, club_id, start_date, is_finished, book_open_library_id, book_title, book_description, book_authors, book_page_count, book_cover_image_url, book_cover_image_width, book_cover_image_height, created_at, creator_member_id)))
with check ((authorize(( SELECT auth.uid() AS uid), id, 'readings.update'::text) AND user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_readings(id, club_id, start_date, is_finished, book_open_library_id, book_title, book_description, book_authors, book_page_count, book_cover_image_url, book_cover_image_width, book_cover_image_height, created_at, creator_member_id)));


