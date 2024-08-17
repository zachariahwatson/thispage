
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."club_permission" AS ENUM (
    'clubs.read',
    'clubs.update',
    'club_invite_codes.create',
    'club_invite_codes.read',
    'club_invite_codes.delete',
    'members.read',
    'members.delete',
    'member_roles.read',
    'member_roles.update',
    'readings.create',
    'readings.read',
    'readings.read.all',
    'readings.update',
    'readings.delete',
    'intervals.read',
    'member_interval_progresses.read',
    'member_interval_progresses.update.own',
    'likes.create',
    'likes.read',
    'posts.create',
    'posts.read',
    'posts.update',
    'posts.update.own',
    'posts.delete',
    'comments.create',
    'comments.read',
    'comments.update.own',
    'comments.delete',
    'likes.delete.own',
    'posts.delete.own',
    'comments.delete.own',
    'members.delete.own',
    'member_interval_progresses.delete.own',
    'member_interval_progresses.create',
    'likes.create.comment',
    'likes.create.post'
);

ALTER TYPE "public"."club_permission" OWNER TO "postgres";

CREATE TYPE "public"."club_role" AS ENUM (
    'member',
    'moderator',
    'admin'
);

ALTER TYPE "public"."club_role" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."authorize"("_user_id" "uuid", "_id" bigint, "_requested_permission" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
    _club_id bigint;
    _is_member boolean;
    _has_permission boolean;
BEGIN
    -- Get the club_id using the get_club_id function
    BEGIN
        SELECT get_club_id(_id, _requested_permission) INTO _club_id;
    EXCEPTION
        WHEN others THEN
            RETURN false;
    END;

    -- Check if the user is a member of the club
    SELECT EXISTS (
        SELECT 1
        FROM public.members
        WHERE user_id = _user_id AND club_id = _club_id
    ) INTO _is_member;

    -- Return false if the user is not a member of the club
    IF NOT _is_member THEN
        RETURN false;
    END IF;

    -- Check if the member has the requested permission
    SELECT EXISTS (
        SELECT 1
        FROM public.member_roles mr
        JOIN public.club_permissions cp ON mr.role = cp.role
        WHERE mr.member_id = (SELECT id FROM public.members WHERE user_id = _user_id AND club_id = _club_id)
        AND cp.permission = _requested_permission::public.club_permission
    ) INTO _has_permission;

    -- Return true if the user is a member of the club and has the requested permission
    RETURN _has_permission;
END;$$;

ALTER FUNCTION "public"."authorize"("_user_id" "uuid", "_id" bigint, "_requested_permission" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."check_member_interval_progresses"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$declare
  _reading_id bigint;
  _interval_page_length bigint;
  _all_complete boolean;
  _new_goal_page bigint;
  _new_interval_id bigint;
begin
  --check if all member progresses are complete for the interval
  select not exists (select 1 from public.member_interval_progresses 
  where interval_id = new.interval_id and is_complete = false) 
  into _all_complete;

  if _all_complete then
    -- get reading id
    select reading_id, goal_page 
    into _reading_id, _new_goal_page
    from public.intervals 
    where id = new.interval_id;

    -- get interval page length
    select interval_page_length 
    into _interval_page_length
    from public.readings
    where id = _reading_id;

    -- calculate new goal page
    _new_goal_page := _new_goal_page + _interval_page_length;

    -- create new interval and return the id
    insert into public.intervals (reading_id, goal_page)
    values (_reading_id, _new_goal_page)
    returning id into _new_interval_id;

    -- create new member progresses for everyone in the interval
    insert into public.member_interval_progresses (member_id, interval_id)
    select member_id, _new_interval_id
    from public.member_interval_progresses
    where interval_id = new.interval_id;

  end if;

  return new;
end;$$;

ALTER FUNCTION "public"."check_member_interval_progresses"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."check_reading_count"("_club_id" bigint) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
  _count bigint;
BEGIN
  SELECT COUNT(*) INTO _count FROM public.readings WHERE club_id = _club_id AND is_finished = FALSE;

  RETURN _count <= 3;
END;$$;

ALTER FUNCTION "public"."check_reading_count"("_club_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."cls_clubs"("_id" bigint, "_created_at" timestamp with time zone, "_creator_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, created_at, creator_user_id
    FROM public.clubs
    WHERE clubs.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      (SELECT creator_user_id FROM original_row) IS NOT DISTINCT FROM _creator_user_id AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  return _res;
END;$$;

ALTER FUNCTION "public"."cls_clubs"("_id" bigint, "_created_at" timestamp with time zone, "_creator_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."cls_comments"("_id" bigint, "_author_member_id" bigint, "_post_id" bigint, "_likes_count" bigint, "_created_at" timestamp with time zone, "_root_comment_id" bigint, "_replying_to_comment_id" bigint) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, author_member_id, post_id, likes_count, created_at, root_comment_id, replying_to_comment_id
    FROM public.posts
    WHERE posts.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT author_member_id FROM original_row) IS NOT DISTINCT FROM _author_member_id AND
      (SELECT post_id FROM original_row) IS NOT DISTINCT FROM _post_id AND
      (SELECT likes_count FROM original_row) IS NOT DISTINCT FROM _likes_count AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      (SELECT root_comment_id FROM original_row) IS NOT DISTINCT FROM _root_comment_id AND
      (SELECT replying_to_comment_id FROM original_row) IS NOT DISTINCT FROM _replying_to_comment_id AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$$;

ALTER FUNCTION "public"."cls_comments"("_id" bigint, "_author_member_id" bigint, "_post_id" bigint, "_likes_count" bigint, "_created_at" timestamp with time zone, "_root_comment_id" bigint, "_replying_to_comment_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."cls_member_interval_progresses"("_id" bigint, "_member_id" bigint, "_interval_id" bigint) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, member_id, interval_id
    FROM public.member_interval_progresses
    WHERE member_interval_progresses.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT member_id FROM original_row) IS NOT DISTINCT FROM _member_id AND
      (SELECT interval_id FROM original_row) IS NOT DISTINCT FROM _interval_id AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$$;

ALTER FUNCTION "public"."cls_member_interval_progresses"("_id" bigint, "_member_id" bigint, "_interval_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."cls_member_roles"("_id" bigint, "_member_id" bigint) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, member_id
    FROM public.member_roles
    WHERE member_roles.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT member_id FROM original_row) IS NOT DISTINCT FROM _member_id AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$$;

ALTER FUNCTION "public"."cls_member_roles"("_id" bigint, "_member_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."cls_posts_others"("_id" bigint, "_reading_id" bigint, "_author_member_id" bigint, "_title" "text", "_content" "text", "_likes_count" bigint, "_created_at" timestamp with time zone) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, reading_id, author_member_id, title, content, likes_count, created_at
    FROM public.posts
    WHERE posts.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT reading_id FROM original_row) IS NOT DISTINCT FROM _reading_id AND
      (SELECT author_member_id FROM original_row) IS NOT DISTINCT FROM _author_member_id AND
      (SELECT title FROM original_row) IS NOT DISTINCT FROM _title AND
      (SELECT content FROM original_row) IS NOT DISTINCT FROM _content AND
      (SELECT likes_count FROM original_row) IS NOT DISTINCT FROM _likes_count AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$$;

ALTER FUNCTION "public"."cls_posts_others"("_id" bigint, "_reading_id" bigint, "_author_member_id" bigint, "_title" "text", "_content" "text", "_likes_count" bigint, "_created_at" timestamp with time zone) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."cls_posts_own"("_id" bigint, "_reading_id" bigint, "_author_member_id" bigint, "_likes_count" bigint, "_created_at" timestamp with time zone) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
  _res BOOLEAN;
BEGIN
  WITH original_row AS (
    SELECT id, reading_id, author_member_id, likes_count, created_at
    FROM public.posts
    WHERE posts.id = _id
  )
  SELECT (
      (SELECT id FROM original_row) IS NOT DISTINCT FROM _id AND
      (SELECT reading_id FROM original_row) IS NOT DISTINCT FROM _reading_id AND
      (SELECT author_member_id FROM original_row) IS NOT DISTINCT FROM _author_member_id AND
      (SELECT likes_count FROM original_row) IS NOT DISTINCT FROM _likes_count AND
      (SELECT created_at FROM original_row) IS NOT DISTINCT FROM _created_at AND
      EXISTS(SELECT COUNT(*) FROM original_row)
  ) INTO _res;

  RETURN _res;
END;$$;

ALTER FUNCTION "public"."cls_posts_own"("_id" bigint, "_reading_id" bigint, "_author_member_id" bigint, "_likes_count" bigint, "_created_at" timestamp with time zone) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."cls_readings"("_id" bigint, "_club_id" bigint, "_start_date" timestamp with time zone, "_is_finished" boolean, "_book_open_library_id" "text", "_book_title" "text", "_book_description" "text", "_book_authors" "text"[], "_book_page_count" bigint, "_book_cover_image_url" "text", "_book_cover_image_width" bigint, "_book_cover_image_height" bigint, "_created_at" timestamp with time zone, "_creator_member_id" bigint) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
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
END;$$;

ALTER FUNCTION "public"."cls_readings"("_id" bigint, "_club_id" bigint, "_start_date" timestamp with time zone, "_is_finished" boolean, "_book_open_library_id" "text", "_book_title" "text", "_book_description" "text", "_book_authors" "text"[], "_book_page_count" bigint, "_book_cover_image_url" "text", "_book_cover_image_width" bigint, "_book_cover_image_height" bigint, "_created_at" timestamp with time zone, "_creator_member_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_club_id"("_id" bigint, "table_name" "text") RETURNS bigint
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
    _club_id bigint;
    _table text;
    _action text;
    _options text;
BEGIN
    SELECT split_part(table_name, '.', 1) INTO _table;
    SELECT split_part(table_name, '.', 2) INTO _action;
    SELECT split_part(table_name, '.', 3) INTO _options;

    --_id will be of the parent id, not the element being inserted's id. (only for insert)
    IF _action = 'create' THEN
        CASE _table
            WHEN 'club_invite_codes' THEN
                _club_id := _id;
            WHEN 'readings' THEN
                _club_id := _id;
            WHEN 'member_interval_progresses' THEN
                SELECT reading_id INTO _club_id FROM public.intervals WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'posts' THEN
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _id;
            WHEN 'comments' THEN
                SELECT reading_id INTO _club_id FROM public.posts WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'likes' THEN
                IF _options = 'comment' THEN
                    SELECT post_id INTO _club_id FROM public.comments WHERE id = _id;
                    SELECT reading_id INTO _club_id FROM public.posts WHERE id = _club_id;
                    SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
                ELSE
                    SELECT reading_id INTO _club_id FROM public.posts WHERE id = _id;
                    SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
                END IF;
            ELSE
                RAISE EXCEPTION 'Invalid permission: %', table_name;
        END CASE;
    ELSE
        --regular id stuff
        CASE _table
            WHEN 'clubs' THEN
                SELECT _id INTO _club_id;
            WHEN 'club_invite_codes' THEN
                SELECT club_id INTO _club_id FROM public.club_invite_codes WHERE id = _id;
            WHEN 'readings' THEN
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _id;
            WHEN 'members' THEN
                SELECT club_id INTO _club_id FROM public.members WHERE id = _id;
            WHEN 'intervals' THEN
                SELECT reading_id INTO _club_id FROM public.intervals WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'member_interval_progresses' THEN
                SELECT interval_id INTO _club_id FROM public.member_interval_progresses WHERE id = _id;
                SELECT reading_id INTO _club_id FROM public.intervals WHERE id = _club_id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'posts' THEN
                SELECT reading_id INTO _club_id FROM public.posts WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'comments' THEN
                SELECT post_id INTO _club_id FROM public.comments WHERE id = _id;
                SELECT reading_id INTO _club_id FROM public.posts WHERE id = _club_id;
                SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
            WHEN 'likes' THEN
                SELECT post_id INTO _club_id FROM public.likes WHERE id = _id;
                IF _club_id IS NULL THEN
                    SELECT comment_id INTO _club_id FROM public.likes WHERE id = _club_id;
                    SELECT post_id INTO _club_id FROM public.comments WHERE id = _club_id;
                    SELECT reading_id INTO _club_id FROM public.posts WHERE id = _club_id;
                    SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
                ELSE
                    SELECT reading_id INTO _club_id FROM public.posts WHERE id = _club_id;
                    SELECT club_id INTO _club_id FROM public.readings WHERE id = _club_id;
                END IF;
            WHEN 'member_roles' THEN
                SELECT member_id INTO _club_id FROM public.member_roles WHERE id = _id;
                SELECT club_id INTO _club_id FROM public.members WHERE id = _club_id;
            ELSE
                RAISE EXCEPTION 'Invalid permission: %', table_name;
        END CASE;
    END IF;
    RETURN _club_id;
END;$$;

ALTER FUNCTION "public"."get_club_id"("_id" bigint, "table_name" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_club"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public.members (user_id, club_id)
  values (new.creator_user_id, new.id);
  return new;
end;$$;

ALTER FUNCTION "public"."handle_new_club"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_member"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public.member_roles (member_id)
  values (new.id);

  -- Check if the new member is the creator of the club
  if exists (select 1 from public.clubs where id = new.club_id and creator_user_id = new.user_id) then
    -- Update the member's role to admin
    update public.member_roles
    set role = 'admin'
    where member_id = new.id;
  end if;
  
  return new;
end;$$;

ALTER FUNCTION "public"."handle_new_member"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_reading"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public.intervals (reading_id, goal_page)
  values (new.id, new.interval_page_length);
  return new;
end;$$;

ALTER FUNCTION "public"."handle_new_reading"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public.users (id, name, first_name, last_name, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."user_is_member"("_user_id" "uuid", "_member_id" bigint) RETURNS boolean 
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  return exists (select 1 from public.members where members.user_id = _user_id and members.id = _member_id);
end;$$;

ALTER FUNCTION "public"."user_is_member"("_user_id" "uuid", "_member_id" bigint) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."club_invite_codes" (
    "id" bigint NOT NULL,
    "club_id" bigint NOT NULL,
    "expiration_date" timestamp with time zone NOT NULL,
    "code" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "uses" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "creator_member_id" bigint
);

ALTER TABLE "public"."club_invite_codes" OWNER TO "postgres";

COMMENT ON TABLE "public"."club_invite_codes" IS 'Club invite codes. Used to invite new members to the club.';

ALTER TABLE "public"."club_invite_codes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."club_invite_codes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."club_permissions" (
    "id" bigint NOT NULL,
    "role" "public"."club_role" NOT NULL,
    "permission" "public"."club_permission" NOT NULL
);

ALTER TABLE "public"."club_permissions" OWNER TO "postgres";

ALTER TABLE "public"."club_permissions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."club_permissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."clubs" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "editor_member_id" bigint,
    "creator_user_id" "uuid"
);

ALTER TABLE "public"."clubs" OWNER TO "postgres";

COMMENT ON TABLE "public"."clubs" IS 'Book clubs.';

ALTER TABLE "public"."clubs" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."clubs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" bigint NOT NULL,
    "content" "text" NOT NULL,
    "author_member_id" bigint,
    "post_id" bigint NOT NULL,
    "likes_count" bigint DEFAULT '0'::bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "root_comment_id" bigint,
    "replying_to_comment_id" bigint
);

ALTER TABLE "public"."comments" OWNER TO "postgres";

COMMENT ON TABLE "public"."comments" IS 'Comments under a post in a reading.';

ALTER TABLE "public"."comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."intervals" (
    "id" bigint NOT NULL,
    "reading_id" bigint NOT NULL,
    "goal_page" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."intervals" OWNER TO "postgres";

COMMENT ON TABLE "public"."intervals" IS 'A reading''s intervals.';

COMMENT ON COLUMN "public"."intervals"."goal_page" IS 'The page that the readers will read to before completing the interval.';

ALTER TABLE "public"."intervals" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."intervals_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."likes" (
    "id" bigint NOT NULL,
    "member_id" bigint,
    "post_id" bigint,
    "comment_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."likes" OWNER TO "postgres";

COMMENT ON TABLE "public"."likes" IS 'Likes on a post or comment.';

ALTER TABLE "public"."likes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."likes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."member_interval_progresses" (
    "id" bigint NOT NULL,
    "member_id" bigint NOT NULL,
    "interval_id" bigint NOT NULL,
    "is_complete" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."member_interval_progresses" OWNER TO "postgres";

COMMENT ON TABLE "public"."member_interval_progresses" IS 'Members'' progress on a reading''s interval.';

ALTER TABLE "public"."member_interval_progresses" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."member_interval_progresses_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."member_roles" (
    "id" bigint NOT NULL,
    "member_id" bigint NOT NULL,
    "updated_at" timestamp with time zone,
    "editor_member_id" bigint,
    "role" "public"."club_role" DEFAULT 'member'::"public"."club_role" NOT NULL
);

ALTER TABLE "public"."member_roles" OWNER TO "postgres";

COMMENT ON TABLE "public"."member_roles" IS 'The role of a member. Used for permissions with RLS.';

ALTER TABLE "public"."member_roles" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."member_roles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."members" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "club_id" bigint NOT NULL,
    "is_favorite" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "used_club_invite_code" "uuid"
);

ALTER TABLE "public"."members" OWNER TO "postgres";

COMMENT ON TABLE "public"."members" IS 'Connects users to clubs.';

ALTER TABLE "public"."members" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."members_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" bigint NOT NULL,
    "reading_id" bigint NOT NULL,
    "author_member_id" bigint,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "likes_count" bigint DEFAULT '0'::bigint NOT NULL,
    "is_spoiler" boolean NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "editor_member_id" bigint
);

ALTER TABLE "public"."posts" OWNER TO "postgres";

COMMENT ON TABLE "public"."posts" IS 'Posts in a reading.';

ALTER TABLE "public"."posts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."posts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."readings" (
    "id" bigint NOT NULL,
    "club_id" bigint NOT NULL,
    "interval_page_length" bigint DEFAULT '10'::bigint NOT NULL,
    "start_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_finished" boolean DEFAULT false NOT NULL,
    "join_in_progress" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "editor_member_id" bigint,
    "creator_member_id" bigint,
    "book_authors" "text"[],
    "book_cover_image_height" bigint,
    "book_cover_image_url" "text",
    "book_cover_image_width" bigint,
    "book_description" "text",
    "book_open_library_id" "text" NOT NULL,
    "book_page_count" bigint NOT NULL,
    "book_title" "text" NOT NULL
);

ALTER TABLE "public"."readings" OWNER TO "postgres";

COMMENT ON TABLE "public"."readings" IS 'A book that the club is reading.';

ALTER TABLE "public"."readings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."readings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "avatar_url" "text",
    "name" "text"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."club_invite_codes"
    ADD CONSTRAINT "club_invite_codes_code_key" UNIQUE ("code");

ALTER TABLE ONLY "public"."club_invite_codes"
    ADD CONSTRAINT "club_invite_codes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."club_permissions"
    ADD CONSTRAINT "club_permissions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."clubs"
    ADD CONSTRAINT "clubs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."intervals"
    ADD CONSTRAINT "intervals_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."member_interval_progresses"
    ADD CONSTRAINT "member_interval_progresses_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."member_roles"
    ADD CONSTRAINT "member_roles_member_id_key" UNIQUE ("member_id");

ALTER TABLE ONLY "public"."member_roles"
    ADD CONSTRAINT "member_roles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."readings"
    ADD CONSTRAINT "readings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

CREATE INDEX "club_invite_codes_club_id_idx" ON "public"."club_invite_codes" USING "btree" ("club_id");

CREATE INDEX "club_invite_codes_creator_member_id_idx" ON "public"."club_invite_codes" USING "btree" ("creator_member_id");

CREATE INDEX "clubs_creator_user_id_idx" ON "public"."clubs" USING "btree" ("creator_user_id");

CREATE INDEX "clubs_editor_member_id_idx" ON "public"."clubs" USING "btree" ("editor_member_id");

CREATE INDEX "comments_author_member_id_idx" ON "public"."comments" USING "btree" ("author_member_id");

CREATE INDEX "comments_post_id_idx" ON "public"."comments" USING "btree" ("post_id");

CREATE INDEX "comments_replying_to_comment_id_idx" ON "public"."comments" USING "btree" ("replying_to_comment_id");

CREATE INDEX "comments_root_comment_id_idx" ON "public"."comments" USING "btree" ("root_comment_id");

CREATE INDEX "intervals_reading_id_idx" ON "public"."intervals" USING "btree" ("reading_id");

CREATE INDEX "likes_comment_id_idx" ON "public"."likes" USING "btree" ("comment_id");

CREATE INDEX "likes_member_id_idx" ON "public"."likes" USING "btree" ("member_id");

CREATE INDEX "likes_post_id_idx" ON "public"."likes" USING "btree" ("post_id");

CREATE INDEX "member_interval_progresses_interval_id_idx" ON "public"."member_interval_progresses" USING "btree" ("interval_id");

CREATE INDEX "member_interval_progresses_member_id_idx" ON "public"."member_interval_progresses" USING "btree" ("member_id");

CREATE INDEX "member_roles_editor_member_id_idx" ON "public"."member_roles" USING "btree" ("editor_member_id");

CREATE INDEX "member_roles_member_id_idx" ON "public"."member_roles" USING "btree" ("member_id");

CREATE INDEX "members_club_id_idx" ON "public"."members" USING "btree" ("club_id");

CREATE INDEX "members_user_id_idx" ON "public"."members" USING "btree" ("user_id");

CREATE INDEX "posts_author_member_id_idx" ON "public"."posts" USING "btree" ("author_member_id");

CREATE INDEX "posts_editor_member_id_idx" ON "public"."posts" USING "btree" ("editor_member_id");

CREATE INDEX "posts_reading_id_idx" ON "public"."posts" USING "btree" ("reading_id");

CREATE INDEX "readings_club_id_idx" ON "public"."readings" USING "btree" ("club_id");

CREATE INDEX "readings_creator_member_id_idx" ON "public"."readings" USING "btree" ("creator_member_id");

CREATE INDEX "readings_editor_member_id_idx" ON "public"."readings" USING "btree" ("editor_member_id");

CREATE OR REPLACE TRIGGER "check_member_interval_progresses_upon_update" AFTER UPDATE ON "public"."member_interval_progresses" FOR EACH ROW EXECUTE FUNCTION "public"."check_member_interval_progresses"();

CREATE OR REPLACE TRIGGER "create_interval_upon_new_reading" AFTER INSERT ON "public"."readings" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_reading"();

CREATE OR REPLACE TRIGGER "create_member_role_upon_new_member" AFTER INSERT ON "public"."members" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_member"();

CREATE OR REPLACE TRIGGER "create_membership_upon_club_creation" AFTER INSERT ON "public"."clubs" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_club"();

ALTER TABLE ONLY "public"."club_invite_codes"
    ADD CONSTRAINT "club_invite_codes_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."club_invite_codes"
    ADD CONSTRAINT "club_invite_codes_creator_member_id_fkey" FOREIGN KEY ("creator_member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."clubs"
    ADD CONSTRAINT "clubs_creator_user_id_fkey" FOREIGN KEY ("creator_user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."clubs"
    ADD CONSTRAINT "clubs_editor_member_id_fkey" FOREIGN KEY ("editor_member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_author_member_id_fkey" FOREIGN KEY ("author_member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_replying_to_comment_id_fkey" FOREIGN KEY ("replying_to_comment_id") REFERENCES "public"."comments"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_root_comment_id_fkey" FOREIGN KEY ("root_comment_id") REFERENCES "public"."comments"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."intervals"
    ADD CONSTRAINT "intervals_reading_id_fkey" FOREIGN KEY ("reading_id") REFERENCES "public"."readings"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."member_interval_progresses"
    ADD CONSTRAINT "member_interval_progresses_interval_id_fkey" FOREIGN KEY ("interval_id") REFERENCES "public"."intervals"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."member_interval_progresses"
    ADD CONSTRAINT "member_interval_progresses_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."member_roles"
    ADD CONSTRAINT "member_roles_editor_member_id_fkey" FOREIGN KEY ("editor_member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."member_roles"
    ADD CONSTRAINT "member_roles_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_used_club_invite_code_fkey" FOREIGN KEY ("used_club_invite_code") REFERENCES "public"."club_invite_codes"("code") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_author_member_id_fkey" FOREIGN KEY ("author_member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_editor_member_id_fkey" FOREIGN KEY ("editor_member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_reading_id_fkey" FOREIGN KEY ("reading_id") REFERENCES "public"."readings"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."readings"
    ADD CONSTRAINT "readings_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."readings"
    ADD CONSTRAINT "readings_creator_member_id_fkey" FOREIGN KEY ("creator_member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."readings"
    ADD CONSTRAINT "readings_editor_member_id_fkey" FOREIGN KEY ("editor_member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Admins can create invite codes" ON "public"."club_invite_codes" FOR INSERT TO "authenticated" WITH CHECK (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "club_id", 'club_invite_codes.create'::"text") AND ("creator_member_id" IS NOT NULL) AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "creator_member_id")));

CREATE POLICY "Admins can create readings" ON "public"."readings" FOR INSERT TO "authenticated" WITH CHECK (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "club_id", 'readings.create'::"text") AND ("creator_member_id" IS NOT NULL) AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "creator_member_id") AND ("is_finished" = false) AND "public"."check_reading_count"("club_id")));

CREATE POLICY "Admins can delete invite codes" ON "public"."club_invite_codes" FOR DELETE TO "authenticated" USING ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'club_invite_codes.delete'::"text"));

CREATE POLICY "Admins can delete readings" ON "public"."readings" FOR DELETE TO "authenticated" USING ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'readings.delete'::"text"));

CREATE POLICY "Admins can read all readings" ON "public"."readings" FOR SELECT TO "authenticated" USING ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'readings.read.all'::"text"));

CREATE POLICY "Admins can update clubs" ON "public"."clubs" FOR UPDATE TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'clubs.update'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "editor_member_id") AND "public"."cls_clubs"("id", "created_at", "creator_user_id"))) WITH CHECK (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'clubs.update'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "editor_member_id") AND "public"."cls_clubs"("id", "created_at", "creator_user_id")));

CREATE POLICY "Admins can update member roles" ON "public"."member_roles" FOR UPDATE TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'member_roles.update'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "editor_member_id") AND "public"."cls_member_roles"("id", "member_id"))) WITH CHECK (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'member_roles.update'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "editor_member_id") AND "public"."cls_member_roles"("id", "member_id")));

CREATE POLICY "Admins can update readings" ON "public"."readings" FOR UPDATE TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'readings.update'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "editor_member_id") AND "public"."cls_readings"("id", "club_id", "start_date", "is_finished", "book_open_library_id", "book_title", "book_description", "book_authors", "book_page_count", "book_cover_image_url", "book_cover_image_width", "book_cover_image_height", "created_at", "creator_member_id"))) WITH CHECK (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'readings.update'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "editor_member_id") AND "public"."cls_readings"("id", "club_id", "start_date", "is_finished", "book_open_library_id", "book_title", "book_description", "book_authors", "book_page_count", "book_cover_image_url", "book_cover_image_width", "book_cover_image_height", "created_at", "creator_member_id")));

CREATE POLICY "Creators can delete their own clubs" ON "public"."clubs" FOR DELETE TO "authenticated" USING (("creator_user_id" = ( SELECT "auth"."uid"() AS "uid")));

CREATE POLICY "Enable read access for authenticated users" ON "public"."club_invite_codes" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read access for authenticated users" ON "public"."clubs" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read access for authenticated users" ON "public"."members" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read access for authenticated users" ON "public"."users" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Members can create comments" ON "public"."comments" FOR INSERT TO "authenticated" WITH CHECK (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "post_id", 'comments.create'::"text") AND ("author_member_id" IS NOT NULL) AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "author_member_id")));

CREATE POLICY "Members can create likes" ON "public"."likes" FOR INSERT TO "authenticated" WITH CHECK (((("post_id" IS NULL) AND ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "comment_id", 'likes.create.comment'::"text") AND ("member_id" IS NOT NULL) AND ("comment_id" IS NOT NULL) AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "member_id"))) OR ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "post_id", 'likes.create.post'::"text") AND ("member_id" IS NOT NULL) AND ("post_id" IS NOT NULL) AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "member_id"))));

CREATE POLICY "Members can create posts" ON "public"."posts" FOR INSERT TO "authenticated" WITH CHECK (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "reading_id", 'posts.create'::"text") AND ("author_member_id" IS NOT NULL) AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "author_member_id")));

CREATE POLICY "Members can create progresses" ON "public"."member_interval_progresses" FOR INSERT TO "authenticated" WITH CHECK (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "interval_id", 'member_interval_progresses.create'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "member_id")));

CREATE POLICY "Members can delete their own comments" ON "public"."comments" FOR DELETE TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'comments.delete.own'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "author_member_id")));

CREATE POLICY "Members can delete their own likes" ON "public"."likes" FOR DELETE TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'likes.delete.own'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "member_id")));

CREATE POLICY "Members can delete their own membership" ON "public"."members" FOR DELETE TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'members.delete.own'::"text") AND ("user_id" = ( SELECT "auth"."uid"() AS "uid"))));

CREATE POLICY "Members can delete their own posts" ON "public"."posts" FOR DELETE TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'posts.delete.own'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "author_member_id")));

CREATE POLICY "Members can delete their own progresses" ON "public"."member_interval_progresses" FOR DELETE TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'member_interval_progresses.delete.own'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "member_id")));

CREATE POLICY "Members can read comments" ON "public"."comments" FOR SELECT TO "authenticated" USING ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'comments.read'::"text"));

CREATE POLICY "Members can read current readings" ON "public"."readings" FOR SELECT TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'readings.read'::"text") AND ("is_finished" = false)));

CREATE POLICY "Members can read intervals" ON "public"."intervals" FOR SELECT TO "authenticated" USING ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'intervals.read'::"text"));

CREATE POLICY "Members can read likes" ON "public"."likes" FOR SELECT TO "authenticated" USING ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'likes.read'::"text"));

CREATE POLICY "Members can read member interval progresses" ON "public"."member_interval_progresses" FOR SELECT TO "authenticated" USING ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'member_interval_progresses.read'::"text"));

CREATE POLICY "Members can read member roles" ON "public"."member_roles" FOR SELECT TO "authenticated" USING ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'member_roles.read'::"text"));

CREATE POLICY "Members can read posts" ON "public"."posts" FOR SELECT TO "authenticated" USING ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'posts.read'::"text"));

CREATE POLICY "Members can update their own comments" ON "public"."comments" FOR UPDATE TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'comments.update.own'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "author_member_id") AND "public"."cls_comments"("id", "author_member_id", "post_id", "likes_count", "created_at", "root_comment_id", "replying_to_comment_id"))) WITH CHECK (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'comments.update.own'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "author_member_id") AND "public"."cls_comments"("id", "author_member_id", "post_id", "likes_count", "created_at", "root_comment_id", "replying_to_comment_id")));

CREATE POLICY "Members can update their own posts" ON "public"."posts" FOR UPDATE TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'posts.update.own'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "author_member_id") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "editor_member_id") AND "public"."cls_posts_own"("id", "reading_id", "author_member_id", "likes_count", "created_at"))) WITH CHECK (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'posts.update.own'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "author_member_id") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "editor_member_id") AND "public"."cls_posts_own"("id", "reading_id", "author_member_id", "likes_count", "created_at")));

CREATE POLICY "Members can update their own progresses" ON "public"."member_interval_progresses" FOR UPDATE TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'member_interval_progresses.update.own'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "member_id") AND "public"."cls_member_interval_progresses"("id", "member_id", "interval_id"))) WITH CHECK (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'member_interval_progresses.update.own'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "member_id") AND "public"."cls_member_interval_progresses"("id", "member_id", "interval_id")));

CREATE POLICY "Moderators can delete comments" ON "public"."comments" FOR DELETE TO "authenticated" USING ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'comments.delete'::"text"));

CREATE POLICY "Moderators can delete members" ON "public"."members" FOR DELETE TO "authenticated" USING ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'members.delete'::"text"));

CREATE POLICY "Moderators can delete posts" ON "public"."posts" FOR DELETE TO "authenticated" USING ("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'posts.delete'::"text"));

CREATE POLICY "Moderators can update posts" ON "public"."posts" FOR UPDATE TO "authenticated" USING (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'posts.update'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "editor_member_id") AND "public"."cls_posts_others"("id", "reading_id", "author_member_id", "title", "content", "likes_count", "created_at"))) WITH CHECK (("public"."authorize"(( SELECT "auth"."uid"() AS "uid"), "id", 'posts.update'::"text") AND "public"."user_is_member"(( SELECT "auth"."uid"() AS "uid"), "editor_member_id") AND "public"."cls_posts_others"("id", "reading_id", "author_member_id", "title", "content", "likes_count", "created_at")));

CREATE POLICY "Users can create clubs" ON "public"."clubs" FOR INSERT TO "authenticated" WITH CHECK ((("creator_user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("creator_user_id" IS NOT NULL)));

CREATE POLICY "Users can create memberships from codes" ON "public"."members" FOR INSERT TO "authenticated" WITH CHECK ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("club_id" = ( SELECT "club_invite_codes"."club_id"
   FROM "public"."club_invite_codes"
  WHERE ("club_invite_codes"."code" = "members"."used_club_invite_code"))) AND (NOT (EXISTS ( SELECT 1
   FROM "public"."members" "m"
  WHERE (("m"."club_id" = "members"."club_id") AND ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))))));

CREATE POLICY "Users can delete their profile" ON "public"."users" FOR DELETE TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid")));

CREATE POLICY "Users can update their own profile" ON "public"."users" FOR UPDATE TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("id" = ( SELECT "auth"."uid"() AS "uid")));

ALTER TABLE "public"."club_invite_codes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."club_permissions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."clubs" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."intervals" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."likes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."member_interval_progresses" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."member_roles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."members" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."readings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."authorize"("_user_id" "uuid", "_id" bigint, "_requested_permission" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."authorize"("_user_id" "uuid", "_id" bigint, "_requested_permission" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."authorize"("_user_id" "uuid", "_id" bigint, "_requested_permission" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."check_member_interval_progresses"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_member_interval_progresses"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_member_interval_progresses"() TO "service_role";

GRANT ALL ON FUNCTION "public"."check_reading_count"("_club_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."check_reading_count"("_club_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_reading_count"("_club_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."cls_clubs"("_id" bigint, "_created_at" timestamp with time zone, "_creator_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."cls_clubs"("_id" bigint, "_created_at" timestamp with time zone, "_creator_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cls_clubs"("_id" bigint, "_created_at" timestamp with time zone, "_creator_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."cls_comments"("_id" bigint, "_author_member_id" bigint, "_post_id" bigint, "_likes_count" bigint, "_created_at" timestamp with time zone, "_root_comment_id" bigint, "_replying_to_comment_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."cls_comments"("_id" bigint, "_author_member_id" bigint, "_post_id" bigint, "_likes_count" bigint, "_created_at" timestamp with time zone, "_root_comment_id" bigint, "_replying_to_comment_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."cls_comments"("_id" bigint, "_author_member_id" bigint, "_post_id" bigint, "_likes_count" bigint, "_created_at" timestamp with time zone, "_root_comment_id" bigint, "_replying_to_comment_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."cls_member_interval_progresses"("_id" bigint, "_member_id" bigint, "_interval_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."cls_member_interval_progresses"("_id" bigint, "_member_id" bigint, "_interval_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."cls_member_interval_progresses"("_id" bigint, "_member_id" bigint, "_interval_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."cls_member_roles"("_id" bigint, "_member_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."cls_member_roles"("_id" bigint, "_member_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."cls_member_roles"("_id" bigint, "_member_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."cls_posts_others"("_id" bigint, "_reading_id" bigint, "_author_member_id" bigint, "_title" "text", "_content" "text", "_likes_count" bigint, "_created_at" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."cls_posts_others"("_id" bigint, "_reading_id" bigint, "_author_member_id" bigint, "_title" "text", "_content" "text", "_likes_count" bigint, "_created_at" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."cls_posts_others"("_id" bigint, "_reading_id" bigint, "_author_member_id" bigint, "_title" "text", "_content" "text", "_likes_count" bigint, "_created_at" timestamp with time zone) TO "service_role";

GRANT ALL ON FUNCTION "public"."cls_posts_own"("_id" bigint, "_reading_id" bigint, "_author_member_id" bigint, "_likes_count" bigint, "_created_at" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."cls_posts_own"("_id" bigint, "_reading_id" bigint, "_author_member_id" bigint, "_likes_count" bigint, "_created_at" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."cls_posts_own"("_id" bigint, "_reading_id" bigint, "_author_member_id" bigint, "_likes_count" bigint, "_created_at" timestamp with time zone) TO "service_role";

GRANT ALL ON FUNCTION "public"."cls_readings"("_id" bigint, "_club_id" bigint, "_start_date" timestamp with time zone, "_is_finished" boolean, "_book_open_library_id" "text", "_book_title" "text", "_book_description" "text", "_book_authors" "text"[], "_book_page_count" bigint, "_book_cover_image_url" "text", "_book_cover_image_width" bigint, "_book_cover_image_height" bigint, "_created_at" timestamp with time zone, "_creator_member_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."cls_readings"("_id" bigint, "_club_id" bigint, "_start_date" timestamp with time zone, "_is_finished" boolean, "_book_open_library_id" "text", "_book_title" "text", "_book_description" "text", "_book_authors" "text"[], "_book_page_count" bigint, "_book_cover_image_url" "text", "_book_cover_image_width" bigint, "_book_cover_image_height" bigint, "_created_at" timestamp with time zone, "_creator_member_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."cls_readings"("_id" bigint, "_club_id" bigint, "_start_date" timestamp with time zone, "_is_finished" boolean, "_book_open_library_id" "text", "_book_title" "text", "_book_description" "text", "_book_authors" "text"[], "_book_page_count" bigint, "_book_cover_image_url" "text", "_book_cover_image_width" bigint, "_book_cover_image_height" bigint, "_created_at" timestamp with time zone, "_creator_member_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_club_id"("_id" bigint, "table_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_club_id"("_id" bigint, "table_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_club_id"("_id" bigint, "table_name" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_club"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_club"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_club"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_member"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_member"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_member"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_reading"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_reading"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_reading"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."user_is_member"("_user_id" "uuid", "_member_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."user_is_member"("_user_id" "uuid", "_member_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_is_member"("_user_id" "uuid", "_member_id" bigint) TO "service_role";

GRANT ALL ON TABLE "public"."club_invite_codes" TO "anon";
GRANT ALL ON TABLE "public"."club_invite_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."club_invite_codes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."club_invite_codes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."club_invite_codes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."club_invite_codes_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."club_permissions" TO "anon";
GRANT ALL ON TABLE "public"."club_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."club_permissions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."club_permissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."club_permissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."club_permissions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."clubs" TO "anon";
GRANT ALL ON TABLE "public"."clubs" TO "authenticated";
GRANT ALL ON TABLE "public"."clubs" TO "service_role";

GRANT ALL ON SEQUENCE "public"."clubs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."clubs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."clubs_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";

GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."intervals" TO "anon";
GRANT ALL ON TABLE "public"."intervals" TO "authenticated";
GRANT ALL ON TABLE "public"."intervals" TO "service_role";

GRANT ALL ON SEQUENCE "public"."intervals_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."intervals_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."intervals_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."likes" TO "anon";
GRANT ALL ON TABLE "public"."likes" TO "authenticated";
GRANT ALL ON TABLE "public"."likes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."likes_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."member_interval_progresses" TO "anon";
GRANT ALL ON TABLE "public"."member_interval_progresses" TO "authenticated";
GRANT ALL ON TABLE "public"."member_interval_progresses" TO "service_role";

GRANT ALL ON SEQUENCE "public"."member_interval_progresses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."member_interval_progresses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."member_interval_progresses_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."member_roles" TO "anon";
GRANT ALL ON TABLE "public"."member_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."member_roles" TO "service_role";

GRANT ALL ON SEQUENCE "public"."member_roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."member_roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."member_roles_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."members" TO "anon";
GRANT ALL ON TABLE "public"."members" TO "authenticated";
GRANT ALL ON TABLE "public"."members" TO "service_role";

GRANT ALL ON SEQUENCE "public"."members_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."members_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."members_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."readings" TO "anon";
GRANT ALL ON TABLE "public"."readings" TO "authenticated";
GRANT ALL ON TABLE "public"."readings" TO "service_role";

GRANT ALL ON SEQUENCE "public"."readings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."readings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."readings_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;

--
-- Dumped schema changes for auth and storage
--

CREATE OR REPLACE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();

