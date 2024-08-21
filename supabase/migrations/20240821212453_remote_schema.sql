alter table "public"."club_invite_codes" alter column "expiration_date" drop not null;

alter table "public"."readings" add column "is_archived" boolean not null default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_member_interval_progresses()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  _reading_id bigint;
  _interval_page_length bigint;
  _all_complete boolean;
  _new_goal_page bigint;
  _old_goal_page bigint;
  _new_interval_id bigint;
  _book_page_count bigint;
begin
  --check if all member progresses are complete for the interval
  select not exists (select 1 from public.member_interval_progresses 
  where interval_id = new.interval_id and is_complete = false) 
  into _all_complete;

  if _all_complete then
    -- get reading id
    select reading_id, goal_page 
    into _reading_id, _new_goal_page
    from public.intervals 
    where id = new.interval_id;

    _old_goal_page := _new_goal_page;

    -- get interval page length
    select interval_page_length, book_page_count 
    into _interval_page_length, _book_page_count
    from public.readings
    where id = _reading_id;

    -- Create new interval only if the old goal page is not already the book's total page count
    if _old_goal_page = _book_page_count then
      -- Mark the reading as finished
      update public.readings
      set is_finished = true
      where id = _reading_id;
    else
      -- calculate new goal page
      _new_goal_page := _new_goal_page + _interval_page_length;

      -- Check if the new goal page exceeds the total page count
      if _new_goal_page >= _book_page_count then
        -- Set the new goal page to the book's total page count
        _new_goal_page := _book_page_count;
      end if;
      
      -- create new interval and return the id
      insert into public.intervals (reading_id, goal_page)
      values (_reading_id, _new_goal_page)
      returning id into _new_interval_id;

      -- create new member progresses for everyone in the interval
      insert into public.member_interval_progresses (member_id, interval_id)
      select member_id, _new_interval_id
      from public.member_interval_progresses
      where interval_id = new.interval_id;
    end if;

  end if;

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

  -- Decrement the uses of the invite code, if applicable
  if new.used_club_invite_code is not null then
    update public.club_invite_codes
    set uses = uses - 1
    where code = new.used_club_invite_code;
    
    -- Delete the invite code if the uses reach zero
    delete from public.club_invite_codes
    where code = new.used_club_invite_code and uses <= 0;
  end if;
  
  return new;
end;$function$
;


