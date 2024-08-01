drop policy "Enable read access for authenticated users" on "public"."books";

drop policy "Admins can update readings" on "public"."readings";

revoke delete on table "public"."books" from "anon";

revoke insert on table "public"."books" from "anon";

revoke references on table "public"."books" from "anon";

revoke select on table "public"."books" from "anon";

revoke trigger on table "public"."books" from "anon";

revoke truncate on table "public"."books" from "anon";

revoke update on table "public"."books" from "anon";

revoke delete on table "public"."books" from "authenticated";

revoke insert on table "public"."books" from "authenticated";

revoke references on table "public"."books" from "authenticated";

revoke select on table "public"."books" from "authenticated";

revoke trigger on table "public"."books" from "authenticated";

revoke truncate on table "public"."books" from "authenticated";

revoke update on table "public"."books" from "authenticated";

revoke delete on table "public"."books" from "service_role";

revoke insert on table "public"."books" from "service_role";

revoke references on table "public"."books" from "service_role";

revoke select on table "public"."books" from "service_role";

revoke trigger on table "public"."books" from "service_role";

revoke truncate on table "public"."books" from "service_role";

revoke update on table "public"."books" from "service_role";

alter table "public"."books" drop constraint "books_open_library_id_key";

alter table "public"."readings" drop constraint "readings_book_id_fkey";

drop function if exists "public"."cls_readings"(_id bigint, _club_id bigint, _book_id bigint, _start_date timestamp with time zone, _is_finished boolean, _created_at timestamp with time zone, _creator_member_id bigint);

alter table "public"."books" drop constraint "books_pkey";

drop index if exists "public"."books_open_library_id_key";

drop index if exists "public"."books_pkey";

drop index if exists "public"."readings_book_id_idx";

drop table "public"."books";

alter table "public"."readings" drop column "book_id";

alter table "public"."readings" add column "book_authors" text[];

alter table "public"."readings" add column "book_cover_image_height" bigint;

alter table "public"."readings" add column "book_cover_image_url" text;

alter table "public"."readings" add column "book_cover_image_width" bigint;

alter table "public"."readings" add column "book_description" text;

alter table "public"."readings" add column "book_open_library_id" text not null;

alter table "public"."readings" add column "book_page_count" bigint not null;

alter table "public"."readings" add column "book_title" text not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cls_readings(_id bigint, _club_id bigint, _start_date timestamp with time zone, _is_finished boolean, _book_open_library_id text, _book_title text, _book_description text, _book_authors text[], _book_page_count bigint, _book_cover_image_url text, _book_cover_image_width bigint, _book_cover_image_height bigint, _created_at timestamp with time zone, _creator_member_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, club_id, start_date, is_finished, book_open_library_id, book_title, book_description, book_authors, book_page_count, book_cover_image_url, book_cover_image_width, book_cover_image_height, created_at, creator_member_id
    FROM public.readings
    WHERE readings.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT club_id FROM original_row) IS NOT DISTINCT FROM _club_id AND
      (SELECT book_id FROM original_row) IS NOT DISTINCT FROM _book_id AND
      (SELECT start_date FROM original_row) IS NOT DISTINCT FROM _start_date AND
      (SELECT is_finished FROM original_row) IS NOT DISTINCT FROM _is_finished AND
      (SELECT book_open_library_id FROM original_row) IS NOT DISTINCT FROM _book_open_library_id AND
      (SELECT book_title FROM original_row) IS NOT DISTINCT FROM _book_title AND
      (SELECT book_description FROM original_row) IS NOT DISTINCT FROM _book_description AND
      (SELECT book_authors FROM original_row) IS NOT DISTINCT FROM _book_authors AND
      (SELECT book_page_count FROM original_row) IS NOT DISTINCT FROM _book_page_count AND
      (SELECT book_cover_image_url FROM original_row) IS NOT DISTINCT FROM _book_cover_image_url AND
      (SELECT book_cover_image_width FROM original_row) IS NOT DISTINCT FROM _book_cover_image_width AND
      (SELECT book_cover_image_height FROM original_row) IS NOT DISTINCT FROM _book_cover_image_height AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      (SELECT creator_member_id FROM original_row) IS NOT DISTINCT FROM _creator_member_id AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$function$
;

create policy "Admins can update readings"
on "public"."readings"
as permissive
for update
to authenticated
using ((authorize(( SELECT auth.uid() AS uid), id, 'readings.update'::text) AND user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_readings(id, club_id, start_date, is_finished, book_open_library_id, book_title, book_description, book_authors, book_page_count, book_cover_image_url, book_cover_image_width, book_cover_image_height, created_at, creator_member_id)))
with check ((authorize(( SELECT auth.uid() AS uid), id, 'readings.update'::text) AND user_is_member(( SELECT auth.uid() AS uid), editor_member_id) AND cls_readings(id, club_id, start_date, is_finished, book_open_library_id, book_title, book_description, book_authors, book_page_count, book_cover_image_url, book_cover_image_width, book_cover_image_height, created_at, creator_member_id)));



