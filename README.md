# Instagram Moodboard

Instagram's Saved tab is where inspiration gets lost. Moodboard turns Saved into a workspace for finding more of what you like, and for making something of your own.

![Walkthrough](docs/walkthrough.gif)

Independent concept by Shazaan Raza. Not affiliated with or endorsed by Instagram or Meta.

## Two flows

**Flow A. I like this. Help me find more of it.** Save a post from the feed, keep a note on it, and pick the details you want more of.

**Flow B. This inspires me. Help me make something of my own.** Group a creator board, generate directions from only those posts, and save one to a brief.

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
- Framer Motion for sheets, toasts, and screen changes
- CSS Modules and `src/styles/tokens.css` (no Tailwind)
- Vitest and React Testing Library
- ESLint and Prettier

## Design decisions

### Result labels

Find similar uses three labels, and Exact match is rare on purpose. It shows only when a product is tagged, it has every detail you picked, and it is the same kind of post. Similar product is tagged but misses something. Inspiration has no product tag, so it is a reference rather than a shop result.

### Notes on save

A note belongs to that post on that board. Saving does not force you to choose a moodboard. Taking a post off a board does not unsave it.

### Moodboards live in Saved

There is no new tab. Moodboards sit in Saved, next to All posts and Collections. Profile in the tab bar opens Saved.

### AI is optional

Find similar and Develop an idea are help you can skip. You can save, note, and rearrange a board without generating anything.

## What's simulated

Similarity scores shared attributes. An embedding model can replace it through `SimilarityProvider`. Directions come from templates filled with the posts you picked. An LLM grounded in those posts can replace it through `IdeaProvider`. Neither one calls the network.

## Photos

Real photos are not in the repo. Until a file is there, each post uses its tint and the description in `imageAlt`. Add JPEGs as described in [`public/images/README.md`](public/images/README.md).

## Disclaimer

Independent concept by Shazaan Raza. Not affiliated with or endorsed by Instagram or Meta. "Instagram" is plain text in the system font. This prototype does not use Instagram or Meta logos.

## Try it

On viewports wider than 600px the app sits in a 390×844 phone frame. Under 600px it fills the screen. "Start Flow A" opens the feed. "Start Flow B" opens the Stage design refs board. Changes stay in `localStorage` under `moodboard-v1`. About has **Reset demo data**.

| Route                | Screen          |
| -------------------- | --------------- |
| `/`                  | Feed            |
| `/saved`             | Saved           |
| `/board/:id`         | Board           |
| `/board/:id/similar` | Find similar    |
| `/board/:id/ideas`   | Develop an idea |
| `/brief`             | Brief           |
| `/about`             | About           |

### Try the Stage design refs carousel

Open Stage design refs (Start Flow B, or Saved → Stage design refs). Suggested groups start with **Stage lighting · 8**. Tap **Develop an idea**. Carousel is already selected, and the row says it is based on 5 references. Tap **Generate 3 directions**. After a short shimmer, the first card is **The evolution of a stage**, Carousel · 7 slides, starting with "Opening comparison, then vs now". The other two stay collapsed. Edit the title if you want, then tap **Save to brief**. Open Brief from the board's more menu, or from Saved. Copy as text, or Remove it. Refresh keeps a saved direction under `moodboard-v1`.

### Try the Boot research search

Open Boot research from Saved, then tap **Find similar**. Tall shaft and Distressed leather start on. The grid leads with the Rowan pair and the Pellam pair, both labeled **Exact match** and "via tagged post", then the Brine pair as **Similar product**, then the brown suede pair as **Inspiration** with the handle flea.found. Turn both chips off and the screen asks you to pick at least one thing you like. Open the Rowan card and tap **Save to this board**. The button switches to Saved, that card leaves the results, and the post is on Boot research. Refresh keeps it under `moodboard-v1`.

### Try search by note

Open Saved (the profile icon). The Moodboards tab is selected. In **Search boards, posts and notes**, type `shaft height`. The Posts group shows cobbler.notes and the note "The shaft height is the thing. Want more like this." A search with no hits says nothing matches, and suggests trying a style like square toe.

### Try the save flow

Every post in the feed starts saved. Tap the bookmark once to unsave it, then tap again. A toast says **Saved** and offers **Choose**. Pick a moodboard, or tap **New moodboard**, name it, and tap **Create**. Add a note and tap **Done**. Refresh the page. The new moodboard and the note are still there. Hold the bookmark for about half a second to open the sheet without toggling the save.
