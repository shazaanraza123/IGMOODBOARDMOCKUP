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

## Milestone 3

- Framer Motion runs the save sheet (spring, stiffness 400, damping 40) and the toast (12px slide and fade). Page transitions stay later.
- The feed is `p-hero` plus six other footwear posts. The subtitle under the handle is the category label. Posts have no location field.
- Every feed post starts saved, because every seed post is already on a board. The bookmark toast appears only when a post becomes saved. Unsaving does not toast.
- A 500ms press opens the sheet and does not toggle saved. The click that follows that press is ignored. Keyboard users open the sheet from the toast's Choose button.
- A board row saves or removes the post immediately. Done writes the note onto every board that currently holds the post, then closes. Leaving the sheet without Done keeps those membership changes and drops the unsaved note. A blank note is cleared by the store.
- Boards created in the sheet are general and private.
- Done says "Saved to {name}" for one board, "Saved to {n} moodboards" for several, and "Saved" when the post is saved but on no board. It stays quiet when the post is neither saved nor on a board.
- The tab bar unmounts while a sheet is open. Reels, Messages, and Search use this same toast, with the title only.
- The bookmark pop is a CSS scale from 1 to 1.2 and back. `prefers-reduced-motion` removes that pop and turns the sheet and toast slides into fades.

## Milestone 4

- Search lives in `src/lib/search.ts`. A blank query is not a search. A trimmed query matches board names, captions, handles, attribute labels, and notes, without caring about case. `tall-shaft` is read as "Tall shaft" (`src/lib/labels.ts`). Results are two groups, Boards and Posts. A post is listed once, and a matching note is kept so the reason it matched stays visible.
- The empty search line is `Nothing matches "{query}". Try a style, like square toe.` Other empty lines that the spec did not write: "Nothing saved yet.", "No moodboards yet.", "No notes on this board yet.", and "Nothing shortlisted yet."
- Collections is a fixed 3-column grid. It does not follow the store. The line above it is "This is how Saved works today." All posts lists `savedIds`. A saved post with no board still shows there.
- Notes and Shortlist chips are on every board. Shopping boards also link Find similar from that row. Creator boards keep visible links for Find similar, Develop an idea, and Brief. Suggested groups stay with the later grouping work.
- A board card can be held for 500ms, and it also has an Options button, so rename, delete, and privacy work from the keyboard. Delete asks "Delete {name}?" first and does not unsave the posts. New moodboards from Saved are general and private.
- Share link copies the current URL and toasts "Link copied" even if the clipboard is blocked.
- Move to lists the other boards that do not already hold the post. The detail note saves as you type, and the field keeps a trailing space while you type so the next word is not glued on. The stored note is trimmed. A blank note is cleared. That field has no 140-character cap, so the longer seed notes still fit. Attribute labels capitalize the first letter only, so `tall-shaft` reads "Tall shaft".
- The masonry is two columns with a 4px gap. Tile heights repeat 3:4, 1:1, and 4:5. A note sits in a two-line card at the bottom of its tile. Shortlisted tiles get a "Shortlisted" pill.
