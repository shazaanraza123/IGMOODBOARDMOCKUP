# Instagram Moodboard

Instagram's Saved tab is where inspiration gets lost. Moodboard turns Saved into a workspace for finding more of what you like, and for making something of your own.

Independent concept by Shazaan Raza. Not affiliated with or endorsed by Instagram or Meta.

## Run locally

```bash
npm i
npm run dev
npm test
```

The dev server listens on port **47231** and on `0.0.0.0`. Open `http://127.0.0.1:47231`.

`npm run build` typechecks and writes a production bundle to `dist/`.

## Stack

- React 18, TypeScript (strict), Vite
- React Router v6
- Zustand, persisted to `moodboard-v1`
- Framer Motion for the save sheet and toasts
- CSS Modules and `src/styles/tokens.css` (no Tailwind)
- Vitest and React Testing Library
- ESLint and Prettier

## What you can do right now

The feed shows the hero post and six more. Saved has All posts, a static Collections grid, and Moodboards. Search there matches a board name, a caption, a handle, a style, or a note. Open a board for the masonry grid, notes, shortlist, and the post sheet (move, remove, edit the note). Find similar and Develop an idea are still empty screens. About has **Reset demo data**. Changes stay in `localStorage` under `moodboard-v1`.

| Route                | Screen          |
| -------------------- | --------------- |
| `/`                  | Feed            |
| `/saved`             | Saved           |
| `/board/:id`         | Board           |
| `/board/:id/similar` | Find similar    |
| `/board/:id/ideas`   | Develop an idea |
| `/brief`             | Brief           |
| `/about`             | About           |

On viewports wider than 600px the app sits in a 390×844 phone frame. Under 600px it fills the screen. "Start Flow A" opens the feed. "Start Flow B" opens the Stage design refs board.

### Try search by note

Open Saved (the profile icon). The Moodboards tab is selected. In **Search boards, posts and notes**, type `shaft height`. The Posts group shows cobbler.notes and the note "The shaft height is the thing. Want more like this." A search with no hits says nothing matches, and suggests trying a style like square toe.

### Try the save flow

Every post in the feed starts saved. Tap the bookmark once to unsave it, then tap again. A toast says **Saved** and offers **Choose**. Pick a moodboard, or tap **New moodboard**, name it, and tap **Create**. Add a note and tap **Done**. Refresh the page. The new moodboard and the note are still there. Hold the bookmark for about half a second to open the sheet without toggling the save.

"Instagram" is plain text in the system font. This prototype does not use Instagram or Meta logos.
