import { describe, expect, it } from "vitest";
import { seedBoards } from "../data/boards";
import { getPost } from "../data/posts";
import { suggestGroups } from "../lib/grouping";
import type { Post } from "../types";

function postsFor(boardId: string): Post[] {
  const board = seedBoards.find((entry) => entry.id === boardId);
  if (!board) throw new Error(`Missing ${boardId}`);
  return board.items.map((item) => {
    const post = getPost(item.postId);
    if (!post) throw new Error(`Missing ${item.postId}`);
    return post;
  });
}

describe("suggest groups", () => {
  it("keeps the three strongest stage attributes", () => {
    expect(suggestGroups(postsFor("b-stage"))).toEqual([
      { attribute: "stage-lighting", count: 8 },
      { attribute: "archival-photo", count: 8 },
      { attribute: "monochrome", count: 6 },
    ]);
  });

  it("drops attributes that appear fewer than three times", () => {
    const posts = postsFor("b-stage").slice(0, 2);
    expect(suggestGroups(posts)).toEqual([]);
  });
});
