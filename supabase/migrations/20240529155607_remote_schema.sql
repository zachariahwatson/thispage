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
        SELECT get_club_id(_id, split_part(_requested_permission, '.', 1)) INTO _club_id;
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


