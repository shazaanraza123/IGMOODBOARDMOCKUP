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
- CSS Modules and `src/styles/tokens.css` (no Tailwind)
- Vitest and React Testing Library
- ESLint and Prettier

Zustand (persisted to `moodboard-v1`) and Framer Motion are part of the product and land with the milestones that use them.

## What you can do right now

Milestone 1 is the scaffold. Every route is on screen, empty:

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
