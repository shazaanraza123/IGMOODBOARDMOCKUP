import type { Attribute, Post, ResultKind } from "../types";

export type SimilarityQuery = {
  source: Post;
  posts: readonly Post[];
  selected: readonly Attribute[];
  excludeIds?: readonly string[];
};

export type SimilarResult = {
  postId: string;
  score: number;
  kind: ResultKind;
  matchedAttributes: Attribute[];
};

export interface SimilarityProvider {
  findSimilar(query: SimilarityQuery): SimilarResult[];
}

function intersects(
  left: readonly Attribute[],
  right: readonly Attribute[],
): Attribute[] {
  const have = new Set(right);
  return left.filter((attribute) => have.has(attribute));
}

function kindFor(
  candidate: Post,
  source: Post,
  selected: readonly Attribute[],
): ResultKind {
  const matchesEverySelected =
    selected.length > 0 &&
    selected.every((attribute) => candidate.attributes.includes(attribute));
  if (
    candidate.productTag &&
    matchesEverySelected &&
    candidate.category === source.category
  ) {
    return "exact-product";
  }
  if (candidate.productTag) return "similar-product";
  return "inspiration";
}

export function resultLabel(kind: ResultKind): string {
  switch (kind) {
    case "exact-product":
      return "Exact match";
    case "similar-product":
      return "Similar product";
    case "inspiration":
      return "Inspiration";
  }
}

export function findSimilar(query: SimilarityQuery): SimilarResult[] {
  const { source, posts, selected } = query;
  const excluded = new Set(query.excludeIds ?? []);
  excluded.add(source.id);
  const rest = source.attributes.filter(
    (attribute) => !selected.includes(attribute),
  );

  const ranked = posts
    .filter((candidate) => !excluded.has(candidate.id))
    .map((candidate) => {
      const matchedAttributes = intersects(selected, candidate.attributes);
      const related = intersects(rest, candidate.attributes);
      const score =
        2 * matchedAttributes.length +
        related.length +
        (candidate.category === source.category ? 1 : 0);
      return {
        postId: candidate.id,
        score,
        kind: kindFor(candidate, source, selected),
        matchedAttributes,
        likes: candidate.likes,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || b.likes - a.likes)
    .slice(0, 12);

  return ranked.map(({ postId, score, kind, matchedAttributes }) => ({
    postId,
    score,
    kind,
    matchedAttributes,
  }));
}

export const attributeSimilarity: SimilarityProvider = { findSimilar };
