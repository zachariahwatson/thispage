drop policy "Members can create likes" on "public"."likes";

set check_function_bodies = off;

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
                    SELECT comment_id INTO _club_id FROM public.likes WHERE id = _id;
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

CREATE OR REPLACE FUNCTION public.handle_like_deletion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  -- If the like is associated with a post, decrement the likes_count on that post
  IF OLD.post_id IS NOT NULL THEN
    UPDATE posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;

  -- If the like is associated with a comment, decrement the likes_count on that comment
  ELSE
    UPDATE comments
    SET likes_count = likes_count - 1
    WHERE id = OLD.comment_id;
  END IF;

  RETURN OLD;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_like()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  -- If the like is associated with a post, increment the likes_count on that post
  IF NEW.post_id IS NOT NULL THEN
    UPDATE posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;

  -- If the like is associated with a comment, increment the likes_count on that comment
  ELSE
    UPDATE comments
    SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id;
  END IF;

  RETURN NEW;
END;$function$
;

create policy "Members can create likes"
on "public"."likes"
as permissive
for insert
to authenticated
with check (true);



