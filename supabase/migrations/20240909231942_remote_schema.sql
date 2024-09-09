set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.update_polls_is_finished()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  UPDATE public.polls
  SET status = 'finished'::poll_status
  WHERE end_date IS NOT NULL AND end_date <= now();
END;$function$
;


drop policy "Admins can create many poll items" on "public"."poll_items";

drop policy "Members can create likes" on "public"."likes";

drop policy "Members can create poll items" on "public"."poll_items";

drop policy "Admins can create readings" on "public"."readings";

drop function if exists "public"."check_poll_items_count"(_poll_id bigint, _creator_member_id bigint);

drop function if exists "public"."check_reading_count"(_club_id bigint);

CREATE UNIQUE INDEX unique_member_comment_like ON public.likes USING btree (member_id, comment_id);

CREATE UNIQUE INDEX unique_member_post_like ON public.likes USING btree (member_id, post_id);

alter table "public"."likes" add constraint "unique_member_comment_like" UNIQUE using index "unique_member_comment_like";

alter table "public"."likes" add constraint "unique_member_post_like" UNIQUE using index "unique_member_post_like";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_club_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _count bigint;
BEGIN
  SELECT COUNT(*) INTO _count FROM public.clubs WHERE creator_user_id = NEW.creator_user_id;

  IF _count > 3 THEN
  RAISE EXCEPTION 'user % exceeded the max club count', NEW.creator_user_id
  USING ERRCODE = 'P0003';
  END IF;
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.check_poll_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _count bigint;
BEGIN
  SELECT COUNT(*) INTO _count FROM public.polls WHERE club_id = NEW.club_id AND (status != 'finished'::poll_status OR status != 'archived'::poll_status);

  IF _count > 3 THEN
  RAISE EXCEPTION 'member % exceeded the max poll count in club %', NEW.creator_member_id, NEW.club_id
  USING ERRCODE = 'P0003';
  END IF;
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.check_poll_items_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _count bigint;
BEGIN
  SELECT COUNT(*) INTO _count FROM public.poll_items WHERE poll_id = NEW.poll_id AND creator_member_id = NEW.creator_member_id;

  IF ((SELECT role FROM public.member_roles WHERE member_id = NEW.creator_member_id) != 'admin'::club_role) AND _count > 1 THEN
  RAISE EXCEPTION 'member % exceeded the max poll item count in poll %', NEW.creator_member_id, NEW.poll_id
  USING ERRCODE = 'P0003';
  END IF;
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.check_reading_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _count bigint;
BEGIN
  SELECT COUNT(*) INTO _count FROM public.readings WHERE club_id = NEW.club_id AND is_finished = FALSE;

  IF _count > 3 THEN
  RAISE EXCEPTION 'member % exceeded the max reading count in club %', NEW.creator_member_id, NEW.club_id
  USING ERRCODE = 'P0003';
  END IF;
  RETURN NEW;
END;$function$
;

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

    IF _has_permission = FALSE THEN
        RAISE EXCEPTION 'user does not have the requested permission: %', _requested_permission
        USING ERRCODE = '42501';
    END IF;

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
            WHEN 'polls' THEN
                _club_id := _id;
            WHEN 'member_interval_progresses' THEN
                SELECT reading_id INTO _club_id FROM public.intervals WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'posts' THEN
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _id;
            WHEN 'poll_items' THEN
                SELECT club_id INTO _club_id FROM public.polls WHERE id = _id;
            WHEN 'poll_votes' THEN
                SELECT poll_id INTO _club_id FROM public.poll_items WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.polls WHERE id = _club_id;
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
                RAISE EXCEPTION 'Invalid table name: %', table_name;
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
            WHEN 'polls' THEN
                SELECT club_id INTO _club_id FROM public.polls WHERE id = _id;
            WHEN 'poll_items' THEN
                SELECT poll_id INTO _club_id FROM public.poll_items WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.polls WHERE id = _club_id;
            WHEN 'poll_votes' THEN
                SELECT poll_item_id INTO _club_id FROM public.poll_votes WHERE id = _id;
                SELECT poll_id INTO _club_id FROM public.poll_items WHERE id = _club_id;
                SELECT club_id INTO _club_id FROM public.polls WHERE id = _club_id;
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
                RAISE EXCEPTION 'Invalid table name: %', table_name;
        END CASE;
    END IF;
    RETURN _club_id;
END;$function$
;

create policy "Members can create likes"
on "public"."likes"
as permissive
for insert
to authenticated
with check ((((comment_id IS NOT NULL) AND (authorize(( SELECT auth.uid() AS uid), comment_id, 'likes.create.comment'::text) AND (member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), member_id))) OR (authorize(( SELECT auth.uid() AS uid), post_id, 'likes.create.post'::text) AND (member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), member_id))));


create policy "Members can create poll items"
on "public"."poll_items"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), poll_id, 'poll_items.create'::text) AND (creator_member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), creator_member_id) AND (EXISTS ( SELECT 1
   FROM polls
  WHERE ((polls.id = poll_items.poll_id) AND (polls.is_locked = false))))));


create policy "Admins can create readings"
on "public"."readings"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), club_id, 'readings.create'::text) AND (creator_member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), creator_member_id) AND (is_finished = false)));


CREATE TRIGGER check_club_count_upon_new_club BEFORE INSERT ON public.clubs FOR EACH ROW EXECUTE FUNCTION check_club_count();

CREATE TRIGGER check_poll_items_count_upon_new_poll_item BEFORE INSERT ON public.poll_items FOR EACH ROW EXECUTE FUNCTION check_poll_items_count();

CREATE TRIGGER check_poll_count_upon_new_poll BEFORE INSERT ON public.polls FOR EACH ROW EXECUTE FUNCTION check_poll_count();

CREATE TRIGGER check_reading_count_upon_new_reading BEFORE INSERT ON public.readings FOR EACH ROW EXECUTE FUNCTION check_reading_count();


