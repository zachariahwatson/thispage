set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_club()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.members (user_id, club_id)
  values (new.creator_user_id, new.id);
  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_member()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.member_roles (member_id)
  values (new.id);

  -- Check if the new member is the creator of the club
  if exists (select 1 from public.clubs where id = new.club_id and creator_user_id = new.user_id) then
    -- Update the member's role to admin
    update public.member_roles
    set role = 'admin'
    where member_id = new.id;
  end if;
  
  return new;
end;$function$
;

CREATE TRIGGER create_membership_upon_club_creation AFTER INSERT ON public.clubs FOR EACH ROW EXECUTE FUNCTION handle_new_club();


