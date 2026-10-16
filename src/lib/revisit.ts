import type { Board, BoardItem } from "../types";

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export type RevisitRow = {
  key: string;
  board: Board;
  item: BoardItem;
};

export function savesToRevisit(
  boards: readonly Board[],
  kept: readonly string[],
  now = Date.now(),
): RevisitRow[] {
  const cutoff = now - NINETY_DAYS_MS;
  const keptSet = new Set(kept);
  const rows: RevisitRow[] = [];
  for (const board of boards) {
    for (const item of board.items) {
      const key = `${board.id}:${item.postId}`;
      if (item.addedAt < cutoff && !keptSet.has(key)) {
        rows.push({ key, board, item });
      }
    }
  }
  rows.sort((a, b) => a.item.addedAt - b.item.addedAt);
  const picked: RevisitRow[] = [];
  const seenBoards = new Set<string>();
  for (const row of rows) {
    if (seenBoards.has(row.board.id)) continue;
    seenBoards.add(row.board.id);
    picked.push(row);
    if (picked.length === 3) return picked;
  }
  for (const row of rows) {
    if (picked.some((entry) => entry.key === row.key)) continue;
    picked.push(row);
    if (picked.length === 3) break;
  }
  return picked;
}
