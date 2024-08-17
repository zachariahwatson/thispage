drop policy "Admins can update clubs" on "public"."clubs";

drop policy "Members can update their own comments" on "public"."comments";

drop policy "Members can update their own progresses" on "public"."member_interval_progresses";

drop policy "Admins can update member roles" on "public"."member_roles";

drop policy "Moderators can update posts" on "public"."posts";

drop policy "Admins can update readings" on "public"."readings";

create policy "Admins can update clubs"
on "public"."clubs"
as permissive
for update
to authenticated
using (authorize(( SELECT auth.uid() AS uid), id, 'clubs.update'::text))
with check ((user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_clubs(id, created_at, creator_user_id)));


create policy "Members can update their own comments"
on "public"."comments"
as permissive
for update
to authenticated
using (authorize(( SELECT auth.uid() AS uid), id, 'comments.update.own'::text))
with check ((user_is_member(( SELECT auth.uid() AS uid), author_member_id) AND cls_comments(id, author_member_id, post_id, likes_count, created_at, root_comment_id, replying_to_comment_id)));


create policy "Members can update their own progresses"
on "public"."member_interval_progresses"
as permissive
for update
to authenticated
using (authorize(( SELECT auth.uid() AS uid), id, 'member_interval_progresses.update.own'::text))
with check ((user_is_member(( SELECT auth.uid() AS uid), member_id) AND cls_member_interval_progresses(id, member_id, interval_id)));


create policy "Admins can update member roles"
on "public"."member_roles"
as permissive
for update
to authenticated
using (authorize(( SELECT auth.uid() AS uid), id, 'member_roles.update'::text))
with check ((user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_member_roles(id, member_id)));


create policy "Moderators can update posts"
on "public"."posts"
as permissive
for update
to authenticated
using (authorize(( SELECT auth.uid() AS uid), id, 'posts.update'::text))
with check ((user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_posts_others(id, reading_id, author_member_id, title, content, likes_count, created_at)));


create policy "Admins can update readings"
on "public"."readings"
as permissive
for update
to authenticated
using (authorize(( SELECT auth.uid() AS uid), id, 'readings.update'::text))
with check ((user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_readings(id, club_id, start_date, is_finished, book_open_library_id, book_title, book_description, book_authors, book_page_count, book_cover_image_url, book_cover_image_width, book_cover_image_height, created_at, creator_member_id)));



