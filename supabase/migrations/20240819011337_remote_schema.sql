set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_like_deletion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  -- If the like is associated with a post, decrement the likes_count on that post
  IF OLD.post_id IS NOT NULL THEN
    UPDATE posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;

  -- If the like is associated with a comment, decrement the likes_count on that comment
  ELSE
    UPDATE comments
    SET likes_count = likes_count - 1
    WHERE id = OLD.comment_id;
  END IF;

  RETURN OLD;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_like()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  -- If the like is associated with a post, increment the likes_count on that post
  IF NEW.post_id IS NOT NULL THEN
    UPDATE posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;

  -- If the like is associated with a comment, increment the likes_count on that comment
  ELSE
    UPDATE comments
    SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id;
  END IF;

  RETURN NEW;
END;$function$
;

CREATE TRIGGER decrement_likes_count_upon_like_deletion AFTER DELETE ON public.likes FOR EACH ROW EXECUTE FUNCTION handle_like_deletion();

CREATE TRIGGER increment_likes_count_upon_new_like AFTER INSERT ON public.likes FOR EACH ROW EXECUTE FUNCTION handle_new_like();


