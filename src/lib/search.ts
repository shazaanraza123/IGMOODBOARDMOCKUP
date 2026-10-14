import type { Board, Post } from "../types";
import { attributeLabel } from "./labels";

export type PostMatch = {
  postId: string;
  boardId?: string;
  note?: string;
};

export type MoodboardSearch = {
  boardIds: string[];
  posts: PostMatch[];
};

function includes(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle);
}

function postMatchesFields(post: Post, needle: string): boolean {
  return (
    includes(post.caption, needle) ||
    includes(post.author, needle) ||
    post.attributes.some((attribute) =>
      includes(attributeLabel(attribute), needle),
    )
  );
}

export function searchMoodboard(
  query: string,
  boards: readonly Board[],
  posts: readonly Post[],
  savedIds: readonly string[] = [],
): MoodboardSearch | null {
  const needle = query.trim().toLowerCase();
  if (!needle) return null;

  const byId = new Map(posts.map((post) => [post.id, post]));
  const boardIds = boards
    .filter((board) => includes(board.name, needle))
    .map((board) => board.id);

  const hits: PostMatch[] = [];

  const prefer = (hit: PostMatch) => {
    const index = hits.findIndex((entry) => entry.postId === hit.postId);
    if (index === -1) {
      hits.push(hit);
      return;
    }
    const current = hits[index];
    if (current && !current.note && hit.note) hits[index] = hit;
  };

  for (const board of boards) {
    for (const item of board.items) {
      const post = byId.get(item.postId);
      if (!post) continue;
      const noteMatch = item.note ? includes(item.note, needle) : false;
      if (!noteMatch && !postMatchesFields(post, needle)) continue;
      prefer({
        postId: post.id,
        boardId: board.id,
        note: noteMatch ? item.note : undefined,
      });
    }
  }

  for (const postId of savedIds) {
    if (hits.some((hit) => hit.postId === postId)) continue;
    if (
      boards.some((board) => board.items.some((item) => item.postId === postId))
    ) {
      continue;
    }
    const post = byId.get(postId);
    if (!post || !postMatchesFields(post, needle)) continue;
    hits.push({ postId });
  }

  return { boardIds, posts: hits };
}
