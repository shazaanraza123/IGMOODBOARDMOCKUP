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

## Milestone 2

- Zustand 5 persists `{ boards, savedIds, briefs }` under `moodboard-v1`. `getItem`, `setItem`, `removeItem`, and `JSON.parse` are in try/catch. Corrupt or blocked storage leaves the in-memory seed alone.
- The store module is imported from `main.tsx` so persistence starts when the app loads.
- Every seed board is private. New boards are private too. There is no privacy toggle until the board screen needs one.
- `createBoard` trims the name, ignores a blank name, and returns the new id.
- A post on a board is also in `savedIds`. `toggleSaved` does not remove board items. `removeFromBoard` does not unsave the post. A blank note is cleared.
- `focus` is an optional box on `Post` (`x`, `y`, `w`, `h` as percentages), even though the section 4 sketch omitted it. Find similar can use it later and fall back to center when it is missing.
- The five tagged boots use invented brands: Rowan Bootmakers, Pellam Last Co, Brine Footwear, Quill & Hide, and Kiln Bootworks. The three closest tagged matches (including the one that shares every hero attribute) sit on Summer fits, not Boot research, so a later similarity search of Boot research can still see them.
- Fashion and packaging posts use the shared visual attributes (`typography`, `monochrome`, `carousel-layout`, `minimal-set`). The attribute list has no packaging-only tags.
- Stage posts are weighted so `stage-lighting` and `archival-photo` each appear on 8 of 12. That is the pair the later idea template treats as "The evolution of a stage."
- The board header now reads the store (`12 saved · Private`). The masonry grid is still later, so a seeded board no longer says it is empty. An unknown id still uses the empty copy.
- `PostImage` exists now, with the tint placeholder and an `onError` fallback. The feed does not render posts yet. Expected files are listed in `public/images/README.md`.
