set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_reading()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.intervals (reading_id, goal_page)
  values (new.id, new.interval_page_length);
  return new;
end;$function$
;

CREATE TRIGGER create_interval_upon_new_reading AFTER INSERT ON public.readings FOR EACH STATEMENT EXECUTE FUNCTION handle_new_reading();


