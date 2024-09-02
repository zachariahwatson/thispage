alter table "public"."polls" alter column "description" drop not null;

create or replace view "public"."spreads_count_view" as  SELECT clubs.id AS club_id,
    count(DISTINCT readings.id) AS total_readings,
    count(DISTINCT polls.id) AS total_polls,
    (count(DISTINCT readings.id) + count(DISTINCT polls.id)) AS total_spreads
   FROM ((clubs
     LEFT JOIN readings ON (((readings.club_id = clubs.id) AND (readings.is_archived = false))))
     LEFT JOIN polls ON (((polls.club_id = clubs.id) AND (polls.is_archived = false))))
  GROUP BY clubs.id;



