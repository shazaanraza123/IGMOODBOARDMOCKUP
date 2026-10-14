import { describe, expect, it } from "vitest";
import { seedBoards } from "../data/boards";
import { getPost, posts } from "../data/posts";
import { findSimilar, resultLabel } from "../lib/similarity";
import type { Attribute, Post } from "../types";

const hero = getPost("p-hero");
const boots = seedBoards.find((board) => board.id === "b-boots");

function search(selected: Attribute[], excludeIds?: string[]) {
  if (!hero || !boots) throw new Error("Missing seed");
  return findSimilar({
    source: hero,
    posts,
    selected,
    excludeIds: excludeIds ?? boots.items.map((item) => item.postId),
  });
}

describe("find similar", () => {
  it("ranks Boot research around tall shaft and distressed leather", () => {
    const results = search(["tall-shaft", "distressed-leather"]);
    expect(results.map((result) => result.postId)).toEqual([
      "p-rowan",
      "p-pellam",
      "p-brine",
      "p-sable",
    ]);
    expect(results.map((result) => result.score)).toEqual([9, 7, 4, 4]);
    expect(results.map((result) => result.kind)).toEqual([
      "exact-product",
      "exact-product",
      "similar-product",
      "inspiration",
    ]);
    expect(results[0]?.matchedAttributes).toEqual([
      "tall-shaft",
      "distressed-leather",
    ]);
    expect(results.map((result) => result.postId)).not.toContain("p-hero");
    expect(results.map((result) => result.postId)).not.toContain(
      "p-boot-shaft",
    );
  });

  it("says Exact match only for a tagged post that matches every selected attribute", () => {
    const selected: Attribute[] = ["tall-shaft", "distressed-leather"];
    for (const result of search(selected)) {
      const post = getPost(result.postId);
      const matchesEvery = selected.every((attribute) =>
        post?.attributes.includes(attribute),
      );
      const exact =
        Boolean(post?.productTag) &&
        matchesEvery &&
        post?.category === hero?.category;
      expect(result.kind === "exact-product").toBe(exact);
      expect(resultLabel(result.kind) === "Exact match").toBe(exact);
    }

    const allHero = search(hero?.attributes ?? []);
    expect(allHero.find((result) => result.postId === "p-rowan")?.kind).toBe(
      "exact-product",
    );
    expect(allHero.find((result) => result.postId === "p-pellam")?.kind).toBe(
      "similar-product",
    );
  });

  it("keeps a tagged post in another category off Exact match", () => {
    if (!hero) throw new Error("Missing hero");
    const taggedOther: Post = {
      ...hero,
      id: "p-other-category",
      category: "fashion",
      likes: 10,
      productTag: { name: "Other", brand: "Other Co" },
    };
    const results = findSimilar({
      source: hero,
      posts: [taggedOther],
      selected: ["tall-shaft", "distressed-leather"],
    });
    expect(results[0]?.kind).toBe("similar-product");
  });

  it("ranks a different category below the same category", () => {
    if (!hero) throw new Error("Missing hero");
    const other: Post = {
      ...hero,
      id: "p-other",
      category: "fashion",
      likes: 99999,
      attributes: [...hero.attributes],
    };
    const weaker: Post = {
      ...hero,
      id: "p-weaker",
      likes: 1,
      productTag: undefined,
      attributes: ["tall-shaft"],
    };
    const results = findSimilar({
      source: hero,
      posts: [other, weaker],
      selected: ["tall-shaft", "distressed-leather"],
    });
    expect(results.map((result) => result.postId)).toEqual([
      "p-weaker",
      "p-other",
    ]);
    expect(results[1]?.score).toBeGreaterThan(results[0]?.score ?? 0);
  });

  it("drops a score of 0 and stops at 12", () => {
    if (!hero) throw new Error("Missing hero");
    const extras: Post[] = Array.from({ length: 15 }, (_, index) => ({
      ...hero,
      id: `p-extra-${index}`,
      likes: index,
      productTag: undefined,
      attributes: ["tall-shaft"],
    }));
    const unrelated: Post = {
      ...hero,
      id: "p-unrelated",
      category: "stage",
      likes: 9999,
      attributes: ["stage-lighting"],
      productTag: undefined,
    };
    const results = findSimilar({
      source: hero,
      posts: [...extras, unrelated],
      selected: ["tall-shaft"],
    });
    expect(results).toHaveLength(12);
    expect(results.map((result) => result.postId)).not.toContain("p-unrelated");
    expect(results[0]?.postId).toBe("p-extra-14");
  });
});
