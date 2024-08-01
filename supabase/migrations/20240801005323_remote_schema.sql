drop trigger if exists "create_interval_upon_new_reading" on "public"."readings";

CREATE TRIGGER create_interval_upon_new_reading AFTER INSERT ON public.readings FOR EACH ROW EXECUTE FUNCTION handle_new_reading();


