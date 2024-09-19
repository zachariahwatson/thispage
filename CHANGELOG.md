# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Password recovery page
- View archived readings and polls
- Logging
- Poll ending soon notification
- Theme creation tool

### Changed

- Themes
- Count things with supabase js 'table(count)'
- Styling tweaks

### Fixed

- Reading image alignment issues
- Reading and poll creation form re-rendering upon submit

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
- - Padding between club books

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
