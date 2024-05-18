set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.user_is_in_club(_club_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  return exists (select 1 from public.members where user_profile_id = get_user_profile_id() and club_id = _club_id);
end;$function$
;

create policy "Members can view their clubs' readings"
on "public"."readings"
as permissive
for select
to authenticated
using (user_is_in_club(club_id));



