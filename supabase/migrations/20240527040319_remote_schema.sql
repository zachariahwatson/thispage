alter table "public"."member_roles" alter column "role" set default 'member'::club_role;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_member()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.member_roles (member_id)
  values (new.id);
  return new;
end;$function$
;

CREATE TRIGGER create_member_role_upon_new_member AFTER INSERT ON public.members FOR EACH ROW EXECUTE FUNCTION handle_new_member();


