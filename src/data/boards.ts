import type { Board, BoardItem } from "../types";

const SEEDED_AT = Date.UTC(2026, 3, 2, 15, 0, 0);

function at(minutes: number): number {
  return SEEDED_AT + minutes * 60_000;
}

function item(
  postId: string,
  minutes: number,
  extra?: Pick<BoardItem, "note" | "shortlisted">,
): BoardItem {
  return { postId, addedAt: at(minutes), ...extra };
}

export const seedBoards: Board[] = [
  {
    id: "b-boots",
    name: "Boot research",
    kind: "shopping",
    isPrivate: true,
    createdAt: SEEDED_AT,
    updatedAt: at(17),
    items: [
      item("p-hero", 0),
      item("p-boot-shaft", 1, {
        note: "The shaft height is the thing. Want more like this.",
      }),
      item("p-boot-square", 2, {
        note: "Square toe, and the metal isn't costume-y.",
      }),
      item("p-boot-worn", 3, {
        note: "Worn leather, not distressed on purpose. Keep this.",
      }),
      item("p-boot-short-1", 4, { shortlisted: true }),
      item("p-boot-short-2", 5, { shortlisted: true }),
      item("p-quill", 6),
      item("p-kiln", 7),
      item("p-boot-suede", 8),
      item("p-boot-platform", 9),
      item("p-boot-cream", 10),
      item("p-boot-buckle", 11),
      item("p-boot-point", 12),
      item("p-boot-tall-brown", 13),
      item("p-boot-ankle-black", 14),
      item("p-boot-hardware", 15),
      item("p-boot-low", 16),
      item("p-boot-block", 17),
    ],
  },
  {
    id: "b-stage",
    name: "Stage design refs",
    kind: "creator",
    isPrivate: true,
    createdAt: SEEDED_AT,
    updatedAt: at(32),
    items: [
      item("p-stage-01", 20, {
        note: "The side wash is doing all the work. Steal the angle, not the set.",
      }),
      item("p-stage-02", 21, {
        note: "Old photo, new light. This is the comparison I want.",
      }),
      item("p-stage-03", 22, {
        note: "Crowd in the dark with one hard spot. Save for the opening.",
      }),
      item("p-stage-04", 23, {
        note: "The type on the backdrop is part of the set, not a caption.",
      }),
      item("p-stage-05", 24, {
        note: "Almost nothing on stage. That's the point.",
      }),
      item("p-stage-06", 25),
      item("p-stage-07", 26),
      item("p-stage-08", 27),
      item("p-stage-09", 28),
      item("p-stage-10", 29),
      item("p-stage-11", 30),
      item("p-stage-12", 31),
    ],
  },
  {
    id: "b-summer",
    name: "Summer fits",
    kind: "general",
    isPrivate: true,
    createdAt: SEEDED_AT,
    updatedAt: at(46),
    items: [
      item("p-rowan", 40),
      item("p-pellam", 41),
      item("p-brine", 42),
      item("p-sable", 43),
      item("p-fashion-linen", 44),
      item("p-fashion-column", 45),
    ],
  },
  {
    id: "b-packaging",
    name: "Packaging ideas",
    kind: "general",
    isPrivate: true,
    createdAt: SEEDED_AT,
    updatedAt: at(54),
    items: [
      item("p-pack-sleeve", 50),
      item("p-pack-tin", 51),
      item("p-pack-mailer", 52),
      item("p-pack-label", 53),
    ],
  },
];

export function collectSavedIds(boards: Board[]): string[] {
  const ids: string[] = [];
  for (const board of boards) {
    for (const entry of board.items) {
      if (!ids.includes(entry.postId)) ids.push(entry.postId);
    }
  }
  return ids;
}
