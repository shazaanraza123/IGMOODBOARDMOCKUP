import { beforeEach, describe, expect, it, vi } from "vitest";
import { seedBoards } from "../data/boards";
import { getPost, posts } from "../data/posts";
import { MOODBOARD_STORAGE_KEY } from "../store/storage";
import { useMoodboardStore } from "../store/useMoodboardStore";
import type { Attribute, IdeaDirection } from "../types";

const heroAttributes: Attribute[] = [
  "tall-shaft",
  "distressed-leather",
  "square-toe",
  "metal-hardware",
  "black",
  "low-heel",
];

function board(id: string) {
  const found = useMoodboardStore
    .getState()
    .boards.find((entry) => entry.id === id);
  if (!found) throw new Error(`Missing board ${id}`);
  return found;
}

beforeEach(async () => {
  localStorage.clear();
  useMoodboardStore.getState().resetDemo();
  await useMoodboardStore.persist.rehydrate();
});

describe("seed catalog", () => {
  it("has the seeded post mix, including stage posts kept off the boards", () => {
    expect(posts).toHaveLength(48);
    expect(posts.filter((item) => item.category === "footwear")).toHaveLength(
      22,
    );
    expect(posts.filter((item) => item.category === "stage")).toHaveLength(20);
    expect(
      posts.filter(
        (item) => item.category === "fashion" || item.category === "packaging",
      ),
    ).toHaveLength(6);
    expect(new Set(posts.map((item) => item.id)).size).toBe(48);
    const onBoards = new Set(
      seedBoards.flatMap((board) => board.items.map((item) => item.postId)),
    );
    for (let index = 13; index <= 20; index += 1) {
      const id = `p-stage-${String(index).padStart(2, "0")}`;
      expect(getPost(id)?.category).toBe("stage");
      expect(onBoards.has(id)).toBe(false);
    }
  });

  it("gives every post 3 to 6 attributes and a photo path", () => {
    for (const item of posts) {
      expect(item.attributes.length).toBeGreaterThanOrEqual(3);
      expect(item.attributes.length).toBeLessThanOrEqual(6);
      expect(item.image).toBe(`/images/${item.id}.jpg`);
      expect(item.author.startsWith("@")).toBe(false);
    }
  });

  it("keeps the hero post untagged", () => {
    const hero = getPost("p-hero");
    expect(hero).toMatchObject({
      author: "archive.objects",
      caption:
        "Found these at a flea market. No idea of the brand, anyone know?",
      attributes: heroAttributes,
    });
    expect(hero?.productTag).toBeUndefined();
  });

  it("tags about five footwear posts and nothing else", () => {
    const tagged = posts.filter((item) => item.productTag);
    expect(tagged).toHaveLength(5);
    expect(tagged.every((item) => item.category === "footwear")).toBe(true);
    expect(tagged.map((item) => item.productTag?.brand).sort()).toEqual([
      "Brine Footwear",
      "Kiln Bootworks",
      "Pellam Last Co",
      "Quill & Hide",
      "Rowan Bootmakers",
    ]);
  });
});

describe("seed boards", () => {
  it("matches the four demo boards", () => {
    expect(
      seedBoards.map((entry) => [
        entry.id,
        entry.name,
        entry.kind,
        entry.items.length,
      ]),
    ).toEqual([
      ["b-boots", "Boot research", "shopping", 18],
      ["b-stage", "Stage design refs", "creator", 12],
      ["b-summer", "Summer fits", "general", 6],
      ["b-packaging", "Packaging ideas", "general", 4],
    ]);
    expect(seedBoards.every((entry) => entry.isPrivate)).toBe(true);
  });

  it("puts the hero on boot research, with notes and a shortlist", () => {
    const boots = seedBoards[0];
    expect(boots?.items.some((entry) => entry.postId === "p-hero")).toBe(true);
    expect(boots?.items.filter((entry) => entry.note)).toHaveLength(3);
    expect(boots?.items.filter((entry) => entry.shortlisted)).toHaveLength(2);
  });

  it("fills the stage board with stage posts and five notes", () => {
    const stage = seedBoards[1];
    expect(stage?.items).toHaveLength(12);
    expect(stage?.items.filter((entry) => entry.note)).toHaveLength(5);
    for (const entry of stage?.items ?? []) {
      expect(getPost(entry.postId)?.category).toBe("stage");
    }
    const counts = new Map<Attribute, number>();
    for (const entry of stage?.items ?? []) {
      for (const attribute of getPost(entry.postId)?.attributes ?? []) {
        counts.set(attribute, (counts.get(attribute) ?? 0) + 1);
      }
    }
    expect(counts.get("stage-lighting")).toBe(8);
    expect(counts.get("archival-photo")).toBe(8);
  });

  it("only references posts that exist", () => {
    for (const entry of seedBoards.flatMap((item) => item.items)) {
      expect(getPost(entry.postId)).toBeDefined();
    }
  });
});

describe("moodboard store", () => {
  it("starts from the seed and treats board posts as saved", () => {
    const state = useMoodboardStore.getState();
    expect(state.boards).toHaveLength(4);
    expect(state.briefs).toEqual([]);
    expect(state.savedIds).toContain("p-hero");
    expect(state.savedIds).toHaveLength(40);
  });

  it("toggles saved without dropping the post from its board", () => {
    useMoodboardStore.getState().toggleSaved("p-hero");
    expect(useMoodboardStore.getState().savedIds).not.toContain("p-hero");
    expect(
      board("b-boots").items.some((entry) => entry.postId === "p-hero"),
    ).toBe(true);
    useMoodboardStore.getState().toggleSaved("p-hero");
    expect(useMoodboardStore.getState().savedIds).toContain("p-hero");
  });

  it("creates, renames, and deletes a board", () => {
    const id = useMoodboardStore
      .getState()
      .createBoard("  Night set  ", "creator");
    expect(id).toBeTruthy();
    expect(board(id ?? "").name).toBe("Night set");
    expect(board(id ?? "").kind).toBe("creator");
    expect(board(id ?? "").isPrivate).toBe(true);
    useMoodboardStore.getState().createBoard("   ", "general");
    expect(
      useMoodboardStore.getState().boards.some((entry) => entry.name === ""),
    ).toBe(false);
    useMoodboardStore.getState().renameBoard(id ?? "", " Late set ");
    expect(board(id ?? "").name).toBe("Late set");
    useMoodboardStore.getState().deleteBoard(id ?? "");
    expect(
      useMoodboardStore.getState().boards.some((entry) => entry.id === id),
    ).toBe(false);
  });

  it("adds a note, shortlists, moves, and removes", () => {
    useMoodboardStore
      .getState()
      .addToBoard("b-boots", "p-rowan", "Closer than it looks.");
    expect(useMoodboardStore.getState().savedIds).toContain("p-rowan");
    const added = board("b-boots").items.find(
      (entry) => entry.postId === "p-rowan",
    );
    expect(added?.note).toBe("Closer than it looks.");
    useMoodboardStore
      .getState()
      .addToBoard("b-boots", "p-rowan", "Updated note");
    expect(
      board("b-boots").items.filter((entry) => entry.postId === "p-rowan"),
    ).toHaveLength(1);
    expect(
      board("b-boots").items.find((entry) => entry.postId === "p-rowan")?.note,
    ).toBe("Updated note");
    useMoodboardStore.getState().setNote("b-boots", "p-rowan", "   ");
    expect(
      board("b-boots").items.find((entry) => entry.postId === "p-rowan")?.note,
    ).toBeUndefined();
    useMoodboardStore.getState().toggleShortlist("b-boots", "p-hero");
    expect(
      board("b-boots").items.find((entry) => entry.postId === "p-hero")
        ?.shortlisted,
    ).toBe(true);
    useMoodboardStore.getState().moveItem("b-boots", "b-summer", "p-hero");
    expect(
      board("b-boots").items.some((entry) => entry.postId === "p-hero"),
    ).toBe(false);
    expect(
      board("b-summer").items.some((entry) => entry.postId === "p-hero"),
    ).toBe(true);
    useMoodboardStore.getState().removeFromBoard("b-summer", "p-hero");
    expect(
      board("b-summer").items.some((entry) => entry.postId === "p-hero"),
    ).toBe(false);
    expect(useMoodboardStore.getState().savedIds).toContain("p-hero");
  });

  it("saves and removes a direction", () => {
    const direction: IdeaDirection = {
      id: "d-1",
      format: "carousel",
      title: "The evolution of a stage",
      summary: "Then and now.",
      structure: ["Opening comparison"],
      sourcePostIds: ["p-stage-01"],
      savedToBrief: false,
    };
    useMoodboardStore.getState().saveDirection(direction);
    expect(useMoodboardStore.getState().briefs).toEqual([
      { ...direction, savedToBrief: true },
    ]);
    useMoodboardStore
      .getState()
      .saveDirection({ ...direction, title: "Revised" });
    expect(useMoodboardStore.getState().briefs).toHaveLength(1);
    expect(useMoodboardStore.getState().briefs[0]?.title).toBe("Revised");
    useMoodboardStore.getState().removeDirection("d-1");
    expect(useMoodboardStore.getState().briefs).toEqual([]);
  });

  it("restores the seed with resetDemo", () => {
    useMoodboardStore.getState().deleteBoard("b-boots");
    useMoodboardStore.getState().toggleSaved("p-hero");
    useMoodboardStore.getState().resetDemo();
    expect(
      useMoodboardStore.getState().boards.map((entry) => entry.id),
    ).toEqual(["b-boots", "b-stage", "b-summer", "b-packaging"]);
    expect(useMoodboardStore.getState().savedIds).toContain("p-hero");
    expect(useMoodboardStore.getState().briefs).toEqual([]);
    expect(seedBoards[0]?.items).toHaveLength(18);
  });

  it("writes moodboard-v1 and brings it back on refresh", async () => {
    const id = useMoodboardStore.getState().createBoard("Night set", "general");
    const snapshot = localStorage.getItem(MOODBOARD_STORAGE_KEY);
    expect(MOODBOARD_STORAGE_KEY).toBe("moodboard-v1");
    expect(snapshot).toContain("Night set");

    useMoodboardStore.setState({ boards: [], savedIds: [], briefs: [] });
    localStorage.setItem(MOODBOARD_STORAGE_KEY, snapshot ?? "");
    await useMoodboardStore.persist.rehydrate();

    expect(
      useMoodboardStore.getState().boards.some((entry) => entry.id === id),
    ).toBe(true);
    expect(useMoodboardStore.getState().createBoard).toEqual(
      expect.any(Function),
    );
  });

  it("still updates memory when storage throws", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("blocked");
      });
    try {
      expect(() =>
        useMoodboardStore.getState().createBoard("Offline", "general"),
      ).not.toThrow();
      expect(
        useMoodboardStore
          .getState()
          .boards.some((entry) => entry.name === "Offline"),
      ).toBe(true);
    } finally {
      setItem.mockRestore();
    }
  });

  it("ignores corrupt storage instead of crashing", async () => {
    localStorage.setItem(MOODBOARD_STORAGE_KEY, "{not json");
    await expect(
      useMoodboardStore.persist.rehydrate(),
    ).resolves.toBeUndefined();
    expect(useMoodboardStore.getState().boards).toHaveLength(4);
  });
});
