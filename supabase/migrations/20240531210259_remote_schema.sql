set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_club_id(_id bigint, table_name text)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    _club_id bigint;
BEGIN
    CASE table_name
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
            RAISE EXCEPTION 'Invalid table name: %', table_name;
    END CASE;

    RETURN _club_id;
END;$function$
;


