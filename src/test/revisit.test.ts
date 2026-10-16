import { describe, expect, it } from "vitest";
import { seedBoards } from "../data/boards";
import { savesToRevisit } from "../lib/revisit";

describe("savesToRevisit", () => {
  const now = Date.parse("2026-10-16T00:00:00Z");

  it("surfaces the oldest saves and skips ones already kept", () => {
    const rows = savesToRevisit(seedBoards, [], now);
    expect(rows).toHaveLength(3);
    expect(new Set(rows.map((row) => row.board.id)).size).toBe(3);

    const kept = savesToRevisit(seedBoards, [rows[0]!.key], now);
    expect(kept.map((row) => row.key)).not.toContain(rows[0]!.key);
    expect(kept).toHaveLength(3);
  });

  it("returns nothing when every save is recent", () => {
    expect(
      savesToRevisit(seedBoards, [], Date.parse("2026-04-01T00:00:00Z")),
    ).toEqual([]);
  });
});
