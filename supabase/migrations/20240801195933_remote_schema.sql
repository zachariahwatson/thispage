drop policy "Enable insert for authenticated users only" on "public"."clubs";

create policy "Enable insert for authenticated users only"
on "public"."clubs"
as permissive
for insert
to public
with check (true);



