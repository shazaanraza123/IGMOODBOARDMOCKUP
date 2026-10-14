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
- CSS Modules and `src/styles/tokens.css` (no Tailwind)
- Vitest and React Testing Library
- ESLint and Prettier

Framer Motion lands with the motion milestone.

## What you can do right now

Milestone 2 is the catalog and the store. About 40 posts and four boards are seeded. Changes persist in `localStorage` under `moodboard-v1`. About has **Reset demo data**. The feed, search, and idea tools are still empty screens:

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

"Instagram" is plain text in the system font. This prototype does not use Instagram or Meta logos.
