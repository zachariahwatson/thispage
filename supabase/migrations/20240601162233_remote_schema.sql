drop policy "Members can read clubs" on "public"."clubs";

create policy "Enable read access for authenticated users"
on "public"."clubs"
as permissive
for select
to authenticated
using (true);



