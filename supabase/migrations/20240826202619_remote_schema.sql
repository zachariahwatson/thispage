alter table "public"."member_interval_progresses" add column "updated_at" timestamp with time zone;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_member_interval_progresses()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  _reading_id bigint;
  _interval_page_length bigint;
  _interval_section_length bigint;
  _all_complete boolean;
  _new_goal_page bigint;
  _old_goal_page bigint;
  _new_goal_section bigint;
  _old_goal_section bigint;
  _new_interval_id bigint;
  _book_page_count bigint;
  _book_sections bigint;
  _increment_type text;
begin
  --check if all member progresses are complete for the interval
  select not exists (select 1 from public.member_interval_progresses 
  where interval_id = new.interval_id and is_complete = false) 
  into _all_complete;

  if _all_complete then
    -- get reading id
    select reading_id, goal_page, goal_section
    into _reading_id, _new_goal_page, _new_goal_section
    from public.intervals 
    where id = new.interval_id;

    --get increment type
    select increment_type, interval_page_length, book_page_count, book_sections, interval_section_length 
    into _increment_type, _interval_page_length, _book_page_count, _book_sections, _interval_section_length
    from public.readings
    where id = _reading_id;

    if _increment_type = 'pages' then
      _old_goal_page := _new_goal_page;

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
      end if;
    else
       _old_goal_section := _new_goal_section;

      -- Create new interval only if the old goal section is not already the book's total sections
      if _old_goal_section = _book_sections then
        -- Mark the reading as finished
        update public.readings
        set is_finished = true
        where id = _reading_id;
      else
        -- calculate new goal section
        _new_goal_section := _new_goal_section + _interval_section_length;

        -- Check if the new goal section exceeds the total section count
        if _new_goal_section >= _book_sections then
          -- Set the new goal section to the book's total section count
          _new_goal_section := _book_sections;
        end if;
      end if;
    end if;
    -- create new interval and return the id
    insert into public.intervals (reading_id, goal_page, goal_section)
    values (_reading_id, _new_goal_page, _new_goal_section)
    returning id into _new_interval_id;

    -- create new member progresses for everyone in the interval
    insert into public.member_interval_progresses (member_id, interval_id)
    select member_id, _new_interval_id
    from public.member_interval_progresses
    where interval_id = new.interval_id;

    -- Update the old interval's is_complete to true
    update public.intervals
    set is_complete = true
    where id = new.interval_id;

  end if;

  return new;
end;$function$
;


