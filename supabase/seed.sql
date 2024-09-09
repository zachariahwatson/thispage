delete from public.club_permissions;

insert into
  public.club_permissions (role, permission)
values
  ('member', 'clubs.read'),
  ('member', 'club_invite_codes.read'),
  ('member', 'members.read'),
  ('member', 'members.delete.own'),
  ('member', 'member_roles.read'),
  ('member', 'readings.read'),
  ('member', 'intervals.read'),
  ('member', 'member_interval_progresses.create'),
  ('member', 'member_interval_progresses.read'),
  ('member', 'member_interval_progresses.update.own'),
  ('member', 'member_interval_progresses.delete.own'),
  ('member', 'likes.create'),
  ('member', 'likes.create.comment'),
  ('member', 'likes.create.post'),
  ('member', 'likes.read'),
  ('member', 'likes.delete.own'),
  ('member', 'posts.create'),
  ('member', 'posts.read'),
  ('member', 'posts.update.own'),
  ('member', 'posts.delete.own'),
  ('member', 'comments.create'),
  ('member', 'comments.read'),
  ('member', 'comments.update.own'),
  ('member', 'comments.delete.own'),
  ('member', 'polls.read'),
  ('member', 'poll_items.read'),
  ('member', 'poll_items.create'),
  ('member', 'poll_items.delete.own'),
  ('member', 'poll_votes.create'),
  ('member', 'poll_votes.read'),
  ('member', 'poll_votes.update.own'),
  ('member', 'poll_votes.delete.own'),
  ('moderator', 'clubs.read'),
  ('moderator', 'club_invite_codes.read'),
  ('moderator', 'members.read'),
  ('moderator', 'members.delete'),
  ('moderator', 'members.delete.own'),
  ('moderator', 'member_roles.read'),
  ('moderator', 'readings.read'),
  ('moderator', 'intervals.read'),
  ('moderator', 'member_interval_progresses.create'),
  ('moderator', 'member_interval_progresses.read'),
  (
    'moderator',
    'member_interval_progresses.update.own'
  ),
  (
    'moderator',
    'member_interval_progresses.delete.own'
  ),
  ('moderator', 'likes.create'),
  ('moderator', 'likes.create.comment'),
  ('moderator', 'likes.create.post'),
  ('moderator', 'likes.read'),
  ('moderator', 'likes.delete.own'),
  ('moderator', 'posts.create'),
  ('moderator', 'posts.read'),
  ('moderator', 'posts.update.own'),
  ('moderator', 'posts.delete.own'),
  ('moderator', 'posts.update'),
  ('moderator', 'posts.delete'),
  ('moderator', 'comments.create'),
  ('moderator', 'comments.read'),
  ('moderator', 'comments.update.own'),
  ('moderator', 'comments.delete.own'),
  ('moderator', 'comments.delete'),
  ('moderator', 'polls.read'),
  ('moderator', 'poll_items.read'),
  ('moderator', 'poll_items.create'),
  ('moderator', 'poll_items.delete'),
  ('moderator', 'poll_items.delete.own'),
  ('moderator', 'poll_votes.create'),
  ('moderator', 'poll_votes.read'),
  ('moderator', 'poll_votes.update.own'),
  ('moderator', 'poll_votes.delete.own'),
  ('admin', 'clubs.read'),
  ('admin', 'clubs.update'),
  ('admin', 'club_invite_codes.create'),
  ('admin', 'club_invite_codes.read'),
  ('admin', 'club_invite_codes.delete'),
  ('admin', 'members.read'),
  ('admin', 'members.delete'),
  ('admin', 'members.delete.own'),
  ('admin', 'member_roles.read'),
  ('admin', 'member_roles.update'),
  ('admin', 'readings.create'),
  ('admin', 'readings.read'),
  ('admin', 'readings.read.all'),
  ('admin', 'readings.update'),
  ('admin', 'readings.delete'),
  ('admin', 'intervals.read'),
  ('admin', 'member_interval_progresses.create'),
  ('admin', 'member_interval_progresses.read'),
  ('admin', 'member_interval_progresses.update.own'),
  ('admin', 'member_interval_progresses.delete.own'),
  ('admin', 'likes.create'),
  ('admin', 'likes.create.comment'),
  ('admin', 'likes.create.post'),
  ('admin', 'likes.read'),
  ('admin', 'likes.delete.own'),
  ('admin', 'posts.create'),
  ('admin', 'posts.read'),
  ('admin', 'posts.update.own'),
  ('admin', 'posts.delete.own'),
  ('admin', 'posts.update'),
  ('admin', 'posts.delete'),
  ('admin', 'comments.create'),
  ('admin', 'comments.read'),
  ('admin', 'comments.update.own'),
  ('admin', 'comments.delete.own'),
  ('admin', 'comments.delete'),
  ('admin', 'polls.read'),
  ('admin', 'polls.read.all'),
  ('admin', 'polls.create'),
  ('admin', 'polls.delete'),
  ('admin', 'polls.update'),
  ('admin', 'poll_items.read'),
  ('admin', 'poll_items.create'),
  ('admin', 'poll_items.create.many'),
  ('admin', 'poll_items.delete'),
  ('admin', 'poll_items.delete.own'),
  ('admin', 'poll_votes.create'),
  ('admin', 'poll_votes.read'),
  ('admin', 'poll_votes.update.own'),
  ('admin', 'poll_votes.delete.own');

