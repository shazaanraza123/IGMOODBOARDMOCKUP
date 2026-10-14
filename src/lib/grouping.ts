import type { Attribute, Post } from "../types";

export type SuggestedGroup = {
  attribute: Attribute;
  count: number;
};

const MINIMUM = 3;
const LIMIT = 3;

export function suggestGroups(posts: readonly Post[]): SuggestedGroup[] {
  const counts = new Map<Attribute, number>();
  const firstSeen = new Map<Attribute, number>();
  let seen = 0;

  for (const post of posts) {
    for (const attribute of post.attributes) {
      counts.set(attribute, (counts.get(attribute) ?? 0) + 1);
      if (!firstSeen.has(attribute)) firstSeen.set(attribute, seen);
      seen += 1;
    }
  }

  return [...counts.entries()]
    .filter((entry) => entry[1] >= MINIMUM)
    .sort((a, b) => {
      const byCount = b[1] - a[1];
      if (byCount !== 0) return byCount;
      return (firstSeen.get(a[0]) ?? 0) - (firstSeen.get(b[0]) ?? 0);
    })
    .slice(0, LIMIT)
    .map(([attribute, count]) => ({ attribute, count }));
}
