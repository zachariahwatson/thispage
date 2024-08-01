drop policy "Enable insert for authenticated users only" on "public"."clubs";

create policy "Users can create clubs"
on "public"."clubs"
as permissive
for insert
to authenticated
with check (((creator_user_id = ( SELECT auth.uid() AS uid)) AND (creator_user_id IS NOT NULL)));



