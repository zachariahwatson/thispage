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
  _new_interval_id bigint;
begin
  --check if all member progresses are complete for the interval
  select not exists (select 1 from public.member_interval_progresses 
  where interval_id = new.interval_id and is_complete = false) 
  into _all_complete;

  if _all_complete then
    -- get reading id
    select reading_id, goal_page into _reading_id, _new_goal_page
    from public.intervals 
    where id = new.interval_id;

    -- get interval page length
    select interval_page_length into _interval_page_length
    from public.readings
    where id = _reading_id;

    -- calculate new goal page
    _new_goal_page := _new_goal_page + _interval_page_length;

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

  return new;
end;$function$
;

CREATE TRIGGER check_member_interval_progresses_upon_update AFTER UPDATE ON public.member_interval_progresses FOR EACH ROW EXECUTE FUNCTION check_member_interval_progresses();


