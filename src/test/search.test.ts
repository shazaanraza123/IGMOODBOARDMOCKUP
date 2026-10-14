import { describe, expect, it } from "vitest";
import { seedBoards } from "../data/boards";
import { posts } from "../data/posts";
import { attributeLabel } from "../lib/labels";
import { searchMoodboard } from "../lib/search";

describe("search", () => {
  it("turns attribute ids into labels", () => {
    expect(attributeLabel("tall-shaft")).toBe("Tall shaft");
    expect(attributeLabel("square-toe")).toBe("Square toe");
  });

  it("finds a post by its note, ignoring case", () => {
    const result = searchMoodboard("  SHAFT HEIGHT  ", seedBoards, posts, []);
    expect(result?.posts).toEqual([
      expect.objectContaining({
        postId: "p-boot-shaft",
        boardId: "b-boots",
        note: "The shaft height is the thing. Want more like this.",
      }),
    ]);
    expect(result?.boardIds).toEqual([]);
  });

  it("matches board names, handles, and attribute labels", () => {
    expect(searchMoodboard("packaging", seedBoards, posts)?.boardIds).toEqual([
      "b-packaging",
    ]);
    expect(
      searchMoodboard("cobbler.notes", seedBoards, posts)?.posts.some(
        (hit) => hit.postId === "p-boot-shaft",
      ),
    ).toBe(true);
    const square = searchMoodboard("square toe", seedBoards, posts);
    expect(square?.posts.some((hit) => hit.postId === "p-hero")).toBe(true);
  });

  it("treats a blank query as not searching", () => {
    expect(searchMoodboard("   ", seedBoards, posts)).toBeNull();
  });

  it("returns empty groups when nothing matches", () => {
    expect(searchMoodboard("zzzz-not-a-style", seedBoards, posts)).toEqual({
      boardIds: [],
      posts: [],
    });
  });
});
