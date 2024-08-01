drop policy "Admins can create readings" on "public"."readings";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_reading_count(_club_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _count bigint;
BEGIN
  SELECT COUNT(*) INTO _count FROM public.readings WHERE club_id = _club_id AND is_finished = FALSE;

  RETURN _count <= 3;
END;$function$
;

create policy "Admins can create readings"
on "public"."readings"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), club_id, 'readings.create'::text) AND (creator_member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), creator_member_id) AND (is_finished = false) AND check_reading_count(club_id)));



