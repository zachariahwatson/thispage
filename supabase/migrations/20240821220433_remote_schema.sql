alter table "public"."intervals" add column "goal_section" bigint;

alter table "public"."intervals" alter column "goal_page" drop not null;

alter table "public"."readings" add column "book_sections" bigint;

alter table "public"."readings" add column "is_sections" boolean not null default false;

alter table "public"."readings" add column "section_name" text;


