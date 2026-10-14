# Decisions

## Milestone 1

- The GitHub repo `shazaanraza123/IGMOODBOARDMOCKUP` had no commits, so this checkout was scaffolded in place. Remotes were not changed and nothing was pushed.
- React is 18 and React Router is v6. The Vite template's React 19 default was replaced.
- ESLint and Prettier are the linters. The template shipped oxlint; that config was removed so the stack matches the spec.
- Zustand and Framer Motion are not installed yet. Milestone 1 does not use them. Reels, Messages, and Search show a plain timed notice ("Not part of this concept") instead of the save toast from a later milestone.
- Flow B goes to `/board/b-stage` ("Stage design refs"). Reserved ids for later seed data: `b-boots`, `b-stage`, `b-summer`, `b-packaging`. An unknown id still renders, titled "Moodboard".
- Every board shows both "Find similar" and "Develop an idea" until board kinds exist, so both routes can be opened.
- Board headers leave off the saved count until there is real data.
- The phone frame starts at `min-width: 601px` (wider than 600px). The frame is 390×844, with a 1px `#2A2A2A` border and a 48px radius, on a `#0B0B0B` page. Prettier writes those hex values in lowercase; the colors are the same. The caption under the frame can be wider than 390px so the sentence stays on one line.
- `--tab-bar-height` lives in `global.css`, so `tokens.css` stays the spec's token list.
- A 54px top spacer is reserved in the frame and in the full-bleed layout. Nothing is drawn there.
- The tab bar is 49px of icons plus `max(34px, env(safe-area-inset-bottom))`, so it is 83px when the device does not report a safe area.
- Heart (feed) and New moodboard (Saved) are visible and do nothing for now. Heart is specified as a no-op. New moodboard is wired in a later milestone.
- Any path that is not a screen redirects to the feed.
- React Router v6 is opted into `v7_startTransition` and `v7_relativeSplatPath` so the console stays quiet.
