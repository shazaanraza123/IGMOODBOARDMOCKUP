import type { Attribute, IdeaDirection, Post } from "../types";

export type IdeaFormat = IdeaDirection["format"];

export type IdeaQuery = {
  posts: readonly Post[];
  format: IdeaFormat;
};

export interface IdeaProvider {
  generate(query: IdeaQuery): IdeaDirection[];
}

type Template = {
  id: string;
  title: string;
  summary: string;
  match: (attributes: ReadonlySet<Attribute>) => boolean;
  lines: Record<IdeaFormat, string[]>;
};

const EVOLUTION_SLIDES = [
  "Opening comparison, then vs now",
  "Era 1: what the stage looked like",
  "Era 2",
  "Era 3",
  "Era 4",
  "What stayed the same",
  "Takeaway and a question for comments",
];

const TEMPLATES: Template[] = [
  {
    id: "evolution",
    title: "The evolution of a stage",
    summary: "Then versus now, across the references on this board.",
    match: (attributes) =>
      attributes.has("stage-lighting") && attributes.has("archival-photo"),
    lines: {
      carousel: EVOLUTION_SLIDES,
      reel: [
        "Hook: then versus now",
        "Era 1: what the stage looked like",
        "Era 2",
        "Era 3",
        "What stayed the same",
        "Takeaway and a question for comments",
      ],
      campaign: [
        "Goal: show how a stage changes and what stays",
        "Audience: people saving stage design",
        "Pillar: opening comparison, then versus now",
        "Pillar: four eras of the stage",
        "Pillar: what stayed the same",
        "Posting plan: one carousel, then two short follow-ups",
      ],
    },
  },
  {
    id: "setup",
    title: "Setup day, behind the scenes",
    summary: "The room before the show, from the references you picked.",
    match: (attributes) => attributes.has("behind-the-scenes"),
    lines: {
      carousel: [
        "The room before doors",
        "Load-in, from the wing",
        "Tape, cases, and work light",
        "Who is in frame",
        "What the audience never sees",
        "The last look before the show",
      ],
      reel: [
        "Hook: setup day, before anyone sits down",
        "The wing, before the spot",
        "Tape, cases, and work light",
        "The detail worth a second look",
        "What you would ask the crew",
      ],
      campaign: [
        "Goal: show the work before the show",
        "Audience: people who like the process",
        "Pillar: load-in from the wing",
        "Pillar: the unglamorous details",
        "Pillar: the last look before doors",
        "Posting plan: one carousel on setup day, then a reel the next morning",
      ],
    },
  },
  {
    id: "minimal",
    title: "Less is more: the minimal stages",
    summary: "How little a stage needs when the light does the work.",
    match: (attributes) => attributes.has("minimal-set"),
    lines: {
      carousel: [
        "Almost nothing on stage",
        "One pool of light",
        "What was taken away",
        "The empty space, on purpose",
        "A full look with no backdrop",
        "What you would leave out next time",
      ],
      reel: [
        "Hook: the light is the scenery",
        "What was taken out",
        "One pool of light",
        "The empty space",
        "What you would leave out next time",
      ],
      campaign: [
        "Goal: make the case for a bare stage",
        "Audience: people collecting set ideas",
        "Pillar: what was removed",
        "Pillar: one light doing the work",
        "Pillar: a full look with no backdrop",
        "Posting plan: three posts across a week, stillest image last",
      ],
    },
  },
  {
    id: "crowd",
    title: "The view from the crowd",
    summary: "The show from the floor, not from the booth.",
    match: (attributes) => attributes.has("crowd-shot"),
    lines: {
      carousel: [
        "Where you were standing",
        "One spot, a lot of dark",
        "The people around the frame",
        "What the phone actually caught",
        "The same moment from farther back",
        "A question for anyone who was there",
      ],
      reel: [
        "Hook: shot from the floor",
        "One spot, a lot of dark",
        "The people around you",
        "What the phone caught",
        "A question for anyone who was there",
      ],
      campaign: [
        "Goal: collect the show from the floor",
        "Audience: people who were in the room",
        "Pillar: where you were standing",
        "Pillar: the dark around the spot",
        "Pillar: the same moment from farther back",
        "Posting plan: ask for replies, then post two of them the next day",
      ],
    },
  },
  {
    id: "type",
    title: "The type behind the tour",
    summary: "Lettering that belongs to the set, not a caption added later.",
    match: (attributes) => attributes.has("typography"),
    lines: {
      carousel: [
        "The letters on the set",
        "Type you can read from the room",
        "A proof, before it is finished",
        "The same word in a different light",
        "What the type is doing there",
        "A question about the lettering",
      ],
      reel: [
        "Hook: the type is part of the set",
        "Letters you can read from the back",
        "A proof under the work light",
        "The same word, different light",
        "What the lettering is doing",
      ],
      campaign: [
        "Goal: show the lettering as part of the set",
        "Audience: people who notice type",
        "Pillar: letters on the backdrop",
        "Pillar: proofs before they are finished",
        "Pillar: the same word in a new light",
        "Posting plan: one still a day for three days",
      ],
    },
  },
  {
    id: "tall-boots",
    title: "Five ways to style tall boots",
    summary: "The same tall shaft, styled five ways from this board.",
    match: (attributes) => attributes.has("tall-shaft"),
    lines: {
      carousel: [
        "The shaft, from the side",
        "With a soft trouser",
        "With a short hem",
        "Hardware you can actually see",
        "What you would ask before you buy",
      ],
      reel: [
        "Hook: same boots, five ways",
        "The shaft, from the side",
        "A long hem, then a short one",
        "The hardware, up close",
        "What you would ask before you buy",
      ],
      campaign: [
        "Goal: show one tall boot five ways",
        "Audience: people saving outfit ideas",
        "Pillar: the shaft, from the side",
        "Pillar: hem length",
        "Pillar: hardware you can see",
        "Posting plan: five frames, one a day",
      ],
    },
  },
  {
    id: "square-toe",
    title: "The square-toe comeback",
    summary: "Why this toe shape keeps showing up in the references.",
    match: (attributes) => attributes.has("square-toe"),
    lines: {
      carousel: [
        "The toe shape, up close",
        "Next to a round toe",
        "A full look",
        "The heel that keeps it plain",
        "Why it keeps showing up",
      ],
      reel: [
        "Hook: the square toe is back",
        "The shape, up close",
        "Next to a round toe",
        "The heel that keeps it plain",
        "Why it keeps showing up",
      ],
      campaign: [
        "Goal: explain the square toe without the costume",
        "Audience: people comparing boot shapes",
        "Pillar: the toe, up close",
        "Pillar: beside a round toe",
        "Pillar: the heel that keeps it plain",
        "Posting plan: a carousel, then one reply to comments",
      ],
    },
  },
  {
    id: "leather",
    title: "How to spot quality leather",
    summary: "Crease, edge, and hardware, from the pairs on this board.",
    match: (attributes) =>
      attributes.has("distressed-leather") ||
      attributes.has("smooth-leather") ||
      attributes.has("suede"),
    lines: {
      carousel: [
        "The crease, not the shine",
        "The edge and the sole",
        "Hardware that is fastened",
        "Wear that looks earned",
        "A question for people who own a pair",
      ],
      reel: [
        "Hook: ignore the shine",
        "The crease",
        "The edge and the sole",
        "Hardware that is fastened",
        "Wear that looks earned",
      ],
      campaign: [
        "Goal: teach a closer look at the leather",
        "Audience: people who save boots before they buy",
        "Pillar: crease, not shine",
        "Pillar: edge and sole",
        "Pillar: hardware and earned wear",
        "Posting plan: three close crops, then a question",
      ],
    },
  },
];

const FALLBACKS: Template[] = [
  {
    id: "shared",
    title: "What these references share",
    summary: "The overlap, said plainly.",
    match: () => true,
    lines: {
      carousel: [
        "The thing that repeats",
        "A second look at it",
        "Where it shows up",
        "What is different around it",
        "What you would keep",
      ],
      reel: [
        "Hook: the thing that repeats",
        "A second look",
        "Where it shows up",
        "What is different",
        "What you would keep",
      ],
      campaign: [
        "Goal: name the overlap in this board",
        "Audience: you, later",
        "Pillar: what repeats",
        "Pillar: what changes around it",
        "Pillar: what you would keep",
        "Posting plan: one post when the board feels full",
      ],
    },
  },
  {
    id: "closer",
    title: "A closer read of the board",
    summary: "Slow down on a few frames.",
    match: () => true,
    lines: {
      carousel: [
        "Start with one frame",
        "What the crop leaves out",
        "The detail in the corner",
        "The same idea, another post",
        "What you want more of",
      ],
      reel: [
        "Hook: one frame, then the detail",
        "What the crop leaves out",
        "The corner of the picture",
        "The same idea again",
        "What you want more of",
      ],
      campaign: [
        "Goal: spend longer on a few frames",
        "Audience: people who already saved these",
        "Pillar: one frame",
        "Pillar: the crop",
        "Pillar: the detail in the corner",
        "Posting plan: two posts, a few days apart",
      ],
    },
  },
  {
    id: "three-cuts",
    title: "One idea, three cuts",
    summary: "The same point, cut three ways.",
    match: () => true,
    lines: {
      carousel: [
        "The idea in one line",
        "Cut one: the wide frame",
        "Cut two: the detail",
        "Cut three: the comparison",
        "The line you want people to reply to",
      ],
      reel: [
        "Hook: the idea in one line",
        "The wide frame",
        "The detail",
        "The comparison",
        "The line you want people to reply to",
      ],
      campaign: [
        "Goal: say one idea three ways",
        "Audience: people skimming saved posts",
        "Pillar: the wide frame",
        "Pillar: the detail",
        "Pillar: the comparison",
        "Posting plan: three cuts, one sitting",
      ],
    },
  },
];

function attributesIn(posts: readonly Post[]): Set<Attribute> {
  const attributes = new Set<Attribute>();
  for (const post of posts) {
    for (const attribute of post.attributes) attributes.add(attribute);
  }
  return attributes;
}

export function generateIdeas(query: IdeaQuery): IdeaDirection[] {
  const attributes = attributesIn(query.posts);
  const sourcePostIds = query.posts.map((post) => post.id);
  const chosen: Template[] = [];
  for (const template of [...TEMPLATES, ...FALLBACKS]) {
    if (chosen.length === 3) break;
    if (chosen.some((item) => item.title === template.title)) continue;
    if (!template.match(attributes)) continue;
    chosen.push(template);
  }

  return chosen.map((template) => ({
    id: `${query.format}-${template.id}-${sourcePostIds.join(".")}`,
    format: query.format,
    title: template.title,
    summary: template.summary,
    structure: template.lines[query.format],
    sourcePostIds,
    savedToBrief: false,
  }));
}

export function formatLine(format: IdeaFormat, count: number): string {
  if (format === "reel") return `Reel · ${count} beats`;
  if (format === "campaign") return `Campaign · ${count} parts`;
  return `Carousel · ${count} slides`;
}

export function creditLine(authors: readonly string[]): string {
  const names = authors.map((author) => `@${author.replace(/^@/, "")}`);
  const count = names.length;
  if (count === 0) return "Credits 0 sources";
  if (count === 1) return `Credits 1 source: ${names[0]}`;
  if (count === 2) return `Credits 2 sources: ${names[0]} and ${names[1]}`;
  return `Credits ${count} sources: ${names[0]}, ${names[1]} and ${count - 2} more`;
}

export function directionPlainText(
  direction: Pick<IdeaDirection, "title" | "format" | "structure">,
  authors: readonly string[],
): string {
  const format =
    direction.format === "reel"
      ? "Reel"
      : direction.format === "campaign"
        ? "Campaign"
        : "Carousel";
  const steps = direction.structure.map(
    (line, index) => `${index + 1}. ${line}`,
  );
  const sources =
    authors.length > 0
      ? `Sources: ${authors.map((author) => `@${author.replace(/^@/, "")}`).join(", ")}`
      : "Sources: none";
  return [direction.title, format, "", ...steps, "", sources].join("\n");
}

export const attributeIdeas: IdeaProvider = { generate: generateIdeas };
