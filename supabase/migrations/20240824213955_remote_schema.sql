create type "public"."reading_increment" as enum ('pages', 'sections');

alter table "public"."readings" add column "increment_type" reading_increment not null default 'pages'::reading_increment;


