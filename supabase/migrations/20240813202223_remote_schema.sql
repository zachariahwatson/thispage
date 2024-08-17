set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.user_is_member(_user_id uuid, _member_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  RETURN EXISTS (SELECT 1 FROM public.members WHERE members.user_id = _user_id AND members.id = _member_id);
END;$function$
;


