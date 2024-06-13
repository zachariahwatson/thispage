drop policy "Admins can create invite codes" on "public"."club_invite_codes";

drop policy "Members can create comments" on "public"."comments";

drop policy "Members can create likes" on "public"."likes";

drop policy "Members can create progresses" on "public"."member_interval_progresses";

drop policy "Members can create posts" on "public"."posts";

drop policy "Admins can create readings" on "public"."readings";

alter type "public"."club_permission" rename to "club_permission__old_version_to_be_dropped";

create type "public"."club_permission" as enum ('clubs.read', 'clubs.update', 'club_invite_codes.create', 'club_invite_codes.read', 'club_invite_codes.delete', 'members.read', 'members.delete', 'member_roles.read', 'member_roles.update', 'readings.create', 'readings.read', 'readings.read.all', 'readings.update', 'readings.delete', 'intervals.read', 'member_interval_progresses.read', 'member_interval_progresses.update.own', 'likes.create', 'likes.read', 'posts.create', 'posts.read', 'posts.update', 'posts.update.own', 'posts.delete', 'comments.create', 'comments.read', 'comments.update.own', 'comments.delete', 'likes.delete.own', 'posts.delete.own', 'comments.delete.own', 'members.delete.own', 'member_interval_progresses.delete.own', 'member_interval_progresses.create', 'likes.create.comment', 'likes.create.post');

alter table "public"."club_permissions" alter column permission type "public"."club_permission" using permission::text::"public"."club_permission";

drop type "public"."club_permission__old_version_to_be_dropped";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize(_user_id uuid, _id bigint, _requested_permission text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    _club_id bigint;
    _is_member boolean;
    _has_permission boolean;
BEGIN
    -- Get the club_id using the get_club_id function
    BEGIN
        SELECT get_club_id(_id, _requested_permission) INTO _club_id;
    EXCEPTION
        WHEN others THEN
            RETURN false;
    END;

    -- Check if the user is a member of the club
    SELECT EXISTS (
        SELECT 1
        FROM public.members
        WHERE user_id = _user_id AND club_id = _club_id
    ) INTO _is_member;

    -- Return false if the user is not a member of the club
    IF NOT _is_member THEN
        RETURN false;
    END IF;

    -- Check if the member has the requested permission
    SELECT EXISTS (
        SELECT 1
        FROM public.member_roles mr
        JOIN public.club_permissions cp ON mr.role = cp.role
        WHERE mr.member_id = (SELECT id FROM public.members WHERE user_id = _user_id AND club_id = _club_id)
        AND cp.permission = _requested_permission::public.club_permission
    ) INTO _has_permission;

    -- Return true if the user is a member of the club and has the requested permission
    RETURN _has_permission;
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_club_id(_id bigint, table_name text)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    _club_id bigint;
    _table text;
    _action text;
    _options text;
BEGIN
    SELECT split_part(table_name, '.', 1) INTO _table;
    SELECT split_part(table_name, '.', 2) INTO _action;
    SELECT split_part(table_name, '.', 3) INTO _options;

    --_id will be of the parent id, not the element being inserted's id. (only for insert)
    IF _action = 'create' THEN
        CASE _table
            WHEN 'club_invite_codes' THEN
                _club_id := _id;
            WHEN 'readings' THEN
                _club_id := _id;
            WHEN 'member_interval_progresses' THEN
                SELECT reading_id INTO _club_id FROM public.intervals WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'posts' THEN
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _id;
            WHEN 'comments' THEN
                SELECT reading_id INTO _club_id FROM public.posts WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'likes' THEN
                IF _options = 'comment' THEN
                    SELECT post_id INTO _club_id FROM public.comments WHERE id = _id;
                    SELECT reading_id INTO _club_id FROM public.posts WHERE id = _club_id;
                    SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
                ELSE
                    SELECT reading_id INTO _club_id FROM public.posts WHERE id = _id;
                    SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
                END IF;
            ELSE
                RAISE EXCEPTION 'Invalid permission: %', table_name;
        END CASE;
    ELSE
        --regular id stuff
        CASE _table
            WHEN 'clubs' THEN
                SELECT _id INTO _club_id;
            WHEN 'club_invite_codes' THEN
                SELECT club_id INTO _club_id FROM public.club_invite_codes WHERE id = _id;
            WHEN 'readings' THEN
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _id;
            WHEN 'members' THEN
                SELECT club_id INTO _club_id FROM public.members WHERE id = _id;
            WHEN 'intervals' THEN
                SELECT reading_id INTO _club_id FROM public.intervals WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'member_interval_progresses' THEN
                SELECT interval_id INTO _club_id FROM public.member_interval_progresses WHERE id = _id;
                SELECT reading_id INTO _club_id FROM public.intervals WHERE id = _club_id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'posts' THEN
                SELECT reading_id INTO _club_id FROM public.posts WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'comments' THEN
                SELECT post_id INTO _club_id FROM public.comments WHERE id = _id;
                SELECT reading_id INTO _club_id FROM public.posts WHERE id = _club_id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'likes' THEN
                SELECT post_id INTO _club_id FROM public.likes WHERE id = _id;
                IF _club_id IS NULL THEN
                    SELECT comment_id INTO _club_id FROM public.likes WHERE id = _club_id;
                    SELECT post_id INTO _club_id FROM public.comments WHERE id = _club_id;
                    SELECT reading_id INTO _club_id FROM public.posts WHERE id = _club_id;
                    SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
                ELSE
                    SELECT reading_id INTO _club_id FROM public.posts WHERE id = _club_id;
                    SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
                END IF;
            WHEN 'member_roles' THEN
                SELECT member_id INTO _club_id FROM public.member_roles WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.members WHERE id = _club_id;
            ELSE
                RAISE EXCEPTION 'Invalid permission: %', table_name;
        END CASE;
    END IF;
    RETURN _club_id;
END;$function$
;

create policy "Admins can create invite codes"
on "public"."club_invite_codes"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), club_id, 'club_invite_codes.create'::text) AND (creator_member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), creator_member_id)));


create policy "Members can create comments"
on "public"."comments"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), post_id, 'comments.create'::text) AND (author_member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), author_member_id)));


create policy "Members can create likes"
on "public"."likes"
as permissive
for insert
to authenticated
with check ((((post_id IS NULL) AND (authorize(( SELECT auth.uid() AS uid), comment_id, 'likes.create.comment'::text) AND (member_id IS NOT NULL) AND (comment_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), member_id))) OR (authorize(( SELECT auth.uid() AS uid), post_id, 'likes.create.post'::text) AND (member_id IS NOT NULL) AND (post_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), member_id))));


create policy "Members can create progresses"
on "public"."member_interval_progresses"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), interval_id, 'member_interval_progresses.create'::text) AND user_is_member(( SELECT auth.uid() AS uid), member_id)));


create policy "Members can create posts"
on "public"."posts"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), reading_id, 'posts.create'::text) AND (author_member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), author_member_id)));


create policy "Admins can create readings"
on "public"."readings"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), club_id, 'readings.create'::text) AND (creator_member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), creator_member_id)));



