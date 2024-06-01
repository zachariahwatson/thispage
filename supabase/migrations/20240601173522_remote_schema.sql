drop policy "Members can read members" on "public"."members";

create policy "Enable read access for authenticated users"
on "public"."members"
as permissive
for select
to authenticated
using (true);



