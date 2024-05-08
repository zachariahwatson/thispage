alter table "public"."books" drop constraint "books_olid_key";

drop index if exists "public"."books_olid_key";

alter table "public"."books" drop column "olid";

alter table "public"."books" add column "open_library_id" text not null;

CREATE UNIQUE INDEX books_olid_key ON public.books USING btree (open_library_id);

alter table "public"."books" add constraint "books_olid_key" UNIQUE using index "books_olid_key";


