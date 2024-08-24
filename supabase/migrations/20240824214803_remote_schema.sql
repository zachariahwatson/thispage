alter table "public"."readings" alter column "section_name" set default 'section'::text;

alter table "public"."readings" alter column "section_name" set not null;


