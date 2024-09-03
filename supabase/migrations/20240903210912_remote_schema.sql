drop policy "Members can create poll votes" on "public"."poll_votes";

drop policy "Members can update their own poll votes" on "public"."poll_votes";

create policy "Members can create poll votes"
on "public"."poll_votes"
as permissive
for insert
to authenticated
with check ((authorize(( SELECT auth.uid() AS uid), poll_item_id, 'poll_votes.create'::text) AND (member_id IS NOT NULL) AND user_is_member(( SELECT auth.uid() AS uid), member_id) AND check_poll_votes_count(poll_item_id, member_id) AND (member_id <> ( SELECT poll_items.creator_member_id
   FROM poll_items
  WHERE (poll_items.id = poll_votes.poll_item_id)))));


create policy "Members can update their own poll votes"
on "public"."poll_votes"
as permissive
for update
to authenticated
using (authorize(( SELECT auth.uid() AS uid), id, 'poll_votes.update.own'::text))
with check ((user_is_member(( SELECT auth.uid() AS uid), member_id) AND cls_poll_votes(id, created_at, member_id) AND (member_id <> ( SELECT poll_items.creator_member_id
   FROM poll_items
  WHERE (poll_items.id = poll_votes.poll_item_id)))));



