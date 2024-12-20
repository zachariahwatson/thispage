# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Logging
- View archived readings and polls
- Handle PGRST116 0 rows error
- Unsubscribe from emails

### Changed

- Count things with supabase js 'table(count)'
- Count poll vote percentage by ballots

### Fixed

- Tabs don't update when a new reading/poll is created

## [1.1.3] - 2024-11-23

### Added

- Tooltip for the reading progress bar

### Changed

- Trying out new complete reading button
- Also trying out infinite stale time to prevent textboxes from resetting due to refetching
- Slightly darkened azul theme's primary color
- Moved completed/uncompleted reader count to avoid confusion with the reading's progress bar

### Fixed

- Archiving a reading correctly updates the spread count
- Emails are no longer sent with other members' emails visible

## [1.1.2] - 2024-11-23

### Fixed

- Fixed openlibrary.org status always being down

## [1.1.1] - 2024-10-16

### Added

- Alert notifying if openlibrary.org is unreachable

### Changed

- Shortened alt tags for book cover images

## [1.1.0] - 2024-10-16

### Added

- Ability to edit your avatar URL
- Likes list popover for posts and comments
- Reading post list author and "date posted" information

### Changed

- Hide logo on the back of the book when an error occurs
- Blur author information when user isn't allowed to access a post
- Disable query refetch on window focus

## [1.0.7] - 2024-10-15

### Changed

- Order posts by newest first
- Sort post comments by likes

## [1.0.6] - 2024-09-27

### Added

- More themes
- Priority loading for reading and poll podium book images

### Changed

- Error message handling in /login and /reset
- Icon .png locations
- Better input and textarea character count styling
- Discussion and poll item list min height

### Fixed

- Password reset not working
- Nav not updating upon email sign in
- HTML hydration error
- Polls can't be archived (cron job + rls issue)
- Added line break support for posts and comments

## [1.0.5] - 2024-09-24

### Added

- Swipe gesture to close sheets

### Fixed

- Book details title spacing

## [1.0.4] - 2024-09-23

### Added

- More themes
- Temporarily change theme when hovering over theme option

### Changed

- Update client-side ui when poll voting countdown timer reaches zero
- Metadata tweaks
- Icon for polls, theme, and theme tool

## [1.0.3] - 2024-09-23

### Changed

- Reworded demo
- Updated README
- Reverted poll finish detection function back to original - will use webhooks

## [1.0.2] - 2024-09-20

### Added

- Metadata for theme tool, demo posts, terms and conditions, privacy policy, login and reset

### Changed

- Redact post metadata for spoilers - otherwise, do normal metadata

### Fixed

- Poll items are no longer highlightable during the selection phase

## [1.0.1] - 2024-09-20

### Changed

- Updated demo and theme reading page
- Changed root theme to default

## [1.0.0] - 2024-09-20

### Added

- Password reset flow
- Poll ending soon notification
- Poll finished notification
- Theme creation tool

### Changed

- Themes (more soon)
- Styling tweaks
- Finished demo
- Better terms and privacy policy

### Removed

- Bookmark "tails" (for now) - need to find better way to deal with borders and shadows

### Fixed

- Reading and poll creation form re-rendering upon submit
- Reading image alignment issues

## [0.10.4] - 2024-09-10

### Added

- Favorite button for clubs
- Help message explaining that you can edit books on openlibrary.org
- Comments count badge

### Changed

- Minor tweaks
- Shuffle poll items to mitigate serial-position effect

### Removed

- Ability to change book cover url - use Open Library!

### Fixed

- Scroll resetting when voting for items in polls
- Padding between club books

## [0.10.3] - 2024-09-10

### Added

- Sort books by publish date

### Changed

- Reading form logic
- Poll status location
- Only fetch editions when the book work collapsible is open

## [0.10.2] - 2024-09-09

### Added

- Human-friendly error messages

### Changed

- Updated demo pages to reflect ui changes

### Fixed

- Demo poll list width was greater than its container

## [0.10.1] - 2024-09-09

### Added

- Poll phase indicator

### Changed

- Tighter spacing on mobile

## [0.10.0] - 2024-09-06

### Added

- Email notifications for new readings and polls

### Changed

- Rewrote polls to function like an [approval voting system](https://en.wikipedia.org/wiki/Approval_voting)

## [0.9.3] - 2024-09-03

### Added

- Tabs for readings, polls and dashboard

## [0.9.2] - 2024-09-03

### Added

- Filter book search based on language
- Poll email notifications

### Changed

- Replaced all scroll areas with default scroll

### Fixed

- Post title truncation

## [0.9.0] - 2024-09-01

### Added

- Polls
- Ability to archive polls once finished
- Various loading skeletons

### Changed

- Fetching method, should be a smoother experience
- Finished demo page
- Book search only fetches english books for now

## [0.8.3] - 2024-08-27

### Added

- Cancel button on all forms

### Changed

- Shortened toast messages
- Made submit and cancel buttons more mobile friendly on forms

## [0.8.2] - 2024-08-27

### Changed

- Disabled zoom on inputs

## [0.8.1] - 2024-08-27

### Added

- Metadata for the invite page

## [0.8.0] - 2024-08-26

### Added

- Email push notifications when reading goals are completed
- "What's new" popup

### Changed

- Sign up message placement

## [0.7.0] - 2024-08-24

### Added

- Ability to increment readings by user-created sections
- Custom cover images

### Changed

- Remade dashboard with tabs

## [0.6.1] - 2024-08-22

### Fixed

- Client-side application error upon first load

## [0.6.0] - 2024-08-21

### Added

- Reading completion flow
- Archive button for when readings are complete
- Join-in-progress logic
- Invite uses functionality

### Changed

- Invite table

### Fixed

- Avatar fallback initials

## [0.5.2] - 2024-08-20

### Added

- Like button functionality
- Changelog file

[1.1.3]: https://github.com/zachariahwatson/thispage/compare/1.1.2...HEAD
[1.1.2]: https://github.com/zachariahwatson/thispage/compare/1.1.1...1.1.2
[1.1.1]: https://github.com/zachariahwatson/thispage/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/zachariahwatson/thispage/compare/1.0.7...1.1.0
[1.0.7]: https://github.com/zachariahwatson/thispage/compare/1.0.6...1.0.7
[1.0.6]: https://github.com/zachariahwatson/thispage/compare/1.0.5...1.0.6
[1.0.5]: https://github.com/zachariahwatson/thispage/compare/1.0.4...1.0.5
[1.0.4]: https://github.com/zachariahwatson/thispage/compare/1.0.3...1.0.4
[1.0.3]: https://github.com/zachariahwatson/thispage/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/zachariahwatson/thispage/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/zachariahwatson/thispage/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/zachariahwatson/thispage/compare/0.10.4...1.0.0
[0.10.4]: https://github.com/zachariahwatson/thispage/compare/0.10.3...0.10.4
[0.10.3]: https://github.com/zachariahwatson/thispage/compare/0.10.2...0.10.3
[0.10.2]: https://github.com/zachariahwatson/thispage/compare/0.10.1...0.10.2
[0.10.1]: https://github.com/zachariahwatson/thispage/compare/0.10.0...0.10.1
[0.10.0]: https://github.com/zachariahwatson/thispage/compare/0.9.3...0.10.0
[0.9.3]: https://github.com/zachariahwatson/thispage/compare/0.9.2...0.9.3
[0.9.2]: https://github.com/zachariahwatson/thispage/compare/0.9.0...0.9.2
[0.9.0]: https://github.com/zachariahwatson/thispage/compare/0.8.3...0.9.0
[0.8.3]: https://github.com/zachariahwatson/thispage/compare/0.8.2...0.8.3
[0.8.2]: https://github.com/zachariahwatson/thispage/compare/0.8.1...0.8.2
[0.8.1]: https://github.com/zachariahwatson/thispage/compare/0.8.0...0.8.1
[0.8.0]: https://github.com/zachariahwatson/thispage/compare/0.7.0...0.8.0
[0.7.0]: https://github.com/zachariahwatson/thispage/compare/0.6.1...0.7.0
[0.6.1]: https://github.com/zachariahwatson/thispage/compare/0.6.0...0.6.1
[0.6.0]: https://github.com/zachariahwatson/thispage/compare/0.5.2...0.6.0
[0.5.2]: https://github.com/zachariahwatson/thispage/releases/tag/0.5.2
