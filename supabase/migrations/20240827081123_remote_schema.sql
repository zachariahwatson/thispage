create or replace view "public"."club_invite_view" as  SELECT c.id,
    c.name,
    c.description,
    count(m.id) AS total_members
   FROM (clubs c
     LEFT JOIN members m ON ((c.id = m.club_id)))
  GROUP BY c.id, c.name, c.description;



