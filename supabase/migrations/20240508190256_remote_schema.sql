alter table "public"."books" add column "creator_id" uuid not null;

alter table "public"."clubs" add column "creator_id" uuid not null;

alter table "public"."readings" add column "creator_id" uuid not null;

alter table "public"."books" add constraint "books_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."books" validate constraint "books_creator_id_fkey";

alter table "public"."clubs" add constraint "clubs_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."clubs" validate constraint "clubs_creator_id_fkey";

alter table "public"."readings" add constraint "readings_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."readings" validate constraint "readings_creator_id_fkey";

create policy "Profiles are visible to every authenticated user."
on "public"."profiles"
as permissive
for select
to authenticated
using (true);


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



