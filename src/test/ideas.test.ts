import { describe, expect, it } from "vitest";
import { seedBoards } from "../data/boards";
import { getPost } from "../data/posts";
import { creditLine, directionPlainText, generateIdeas } from "../lib/ideas";
import type { Post } from "../types";

const EVOLUTION = [
  "Opening comparison, then vs now",
  "Era 1: what the stage looked like",
  "Era 2",
  "Era 3",
  "Era 4",
  "What stayed the same",
  "Takeaway and a question for comments",
];

function boardPosts(boardId: string): Post[] {
  const board = seedBoards.find((entry) => entry.id === boardId);
  if (!board) throw new Error(`Missing ${boardId}`);
  return [...board.items]
    .sort((a, b) => b.addedAt - a.addedAt)
    .slice(0, 5)
    .map((item) => {
      const post = getPost(item.postId);
      if (!post) throw new Error(`Missing ${item.postId}`);
      return post;
    });
}

describe("generate ideas", () => {
  it("leads Stage design refs with The evolution of a stage for carousel", () => {
    const posts = boardPosts("b-stage");
    const directions = generateIdeas({ posts, format: "carousel" });
    expect(directions).toHaveLength(3);
    expect(new Set(directions.map((direction) => direction.title)).size).toBe(
      3,
    );
    expect(directions[0]?.title).toBe("The evolution of a stage");
    expect(directions[0]?.format).toBe("carousel");
    expect(directions[0]?.structure).toEqual(EVOLUTION);
    expect(directions[0]?.sourcePostIds).toEqual(posts.map((post) => post.id));
    expect(directions.map((direction) => direction.title)).toEqual([
      "The evolution of a stage",
      "Setup day, behind the scenes",
      "Less is more: the minimal stages",
    ]);
  });

  it("starts a reel with a hook and keeps the same title", () => {
    const first = generateIdeas({
      posts: boardPosts("b-stage"),
      format: "reel",
    })[0];
    expect(first?.title).toBe("The evolution of a stage");
    expect(first?.structure.length).toBeGreaterThanOrEqual(5);
    expect(first?.structure.length).toBeLessThanOrEqual(6);
    expect(first?.structure[0]?.toLowerCase().startsWith("hook")).toBe(true);
  });

  it("shapes a campaign as a goal, an audience, three pillars, and a plan", () => {
    const structure = generateIdeas({
      posts: boardPosts("b-stage"),
      format: "campaign",
    })[0]?.structure;
    expect(structure?.[0]).toMatch(/^Goal:/);
    expect(structure?.[1]).toMatch(/^Audience:/);
    expect(
      structure?.filter((line) => line.startsWith("Pillar:")),
    ).toHaveLength(3);
    expect(structure?.at(-1)).toMatch(/^Posting plan:/);
  });

  it("does not use the stage pair when those attributes are absent", () => {
    const posts = ["p-stage-09", "p-stage-10", "p-stage-11", "p-stage-12"].map(
      (id) => {
        const post = getPost(id);
        if (!post) throw new Error(`Missing ${id}`);
        return post;
      },
    );
    const first = generateIdeas({ posts, format: "carousel" })[0];
    expect(first?.title).toBe("Setup day, behind the scenes");
  });

  it("returns three footwear directions for boot references", () => {
    const posts = ["p-hero", "p-rowan", "p-brine", "p-sable"].map((id) => {
      const post = getPost(id);
      if (!post) throw new Error(`Missing ${id}`);
      return post;
    });
    expect(
      generateIdeas({ posts, format: "carousel" }).map(
        (direction) => direction.title,
      ),
    ).toEqual([
      "Five ways to style tall boots",
      "The square-toe comeback",
      "How to spot quality leather",
    ]);
  });

  it("fills three directions when nothing matches a template", () => {
    const hero = getPost("p-hero");
    if (!hero) throw new Error("Missing hero");
    const titles = generateIdeas({
      posts: [{ ...hero, id: "p-plain", attributes: ["black"] }],
      format: "carousel",
    }).map((direction) => direction.title);
    expect(titles).toHaveLength(3);
    expect(new Set(titles).size).toBe(3);
    expect(titles[0]).toBe("What these references share");
  });
});

describe("direction copy", () => {
  it("credits two names and counts the rest", () => {
    expect(creditLine(["type.tour", "crowd.line", "a", "b", "c"])).toBe(
      "Credits 5 sources: @type.tour, @crowd.line and 3 more",
    );
    expect(creditLine(["solo"])).toBe("Credits 1 source: @solo");
  });

  it("copies a plain numbered list", () => {
    expect(
      directionPlainText(
        {
          title: "The evolution of a stage",
          format: "carousel",
          structure: ["Opening comparison, then vs now", "Era 1"],
        },
        ["type.tour"],
      ),
    ).toBe(
      [
        "The evolution of a stage",
        "Carousel",
        "",
        "1. Opening comparison, then vs now",
        "2. Era 1",
        "",
        "Sources: @type.tour",
      ].join("\n"),
    );
  });
});
