import { create } from "zustand";
import { persist } from "zustand/middleware";
import { collectSavedIds, seedBoards } from "../data/boards";
import type { Board, BoardItem, IdeaDirection } from "../types";
import { createSafeLocalStorage, MOODBOARD_STORAGE_KEY } from "./storage";

export type MoodboardData = {
  boards: Board[];
  savedIds: string[];
  briefs: IdeaDirection[];
  keptKeys: string[];
  nudgeDismissed: boolean;
};

export type MoodboardState = MoodboardData & {
  toggleSaved: (postId: string) => void;
  createBoard: (name: string, kind: Board["kind"]) => string | undefined;
  renameBoard: (boardId: string, name: string) => void;
  setPrivate: (boardId: string, isPrivate: boolean) => void;
  deleteBoard: (boardId: string) => void;
  addToBoard: (boardId: string, postId: string, note?: string) => void;
  removeFromBoard: (boardId: string, postId: string) => void;
  moveItem: (fromId: string, toId: string, postId: string) => void;
  setNote: (boardId: string, postId: string, note: string) => void;
  toggleShortlist: (boardId: string, postId: string) => void;
  saveDirection: (direction: IdeaDirection) => void;
  removeDirection: (id: string) => void;
  addMember: (boardId: string, handle: string) => void;
  addComment: (boardId: string, text: string) => void;
  keepSave: (key: string) => void;
  dismissNudge: () => void;
  resetDemo: () => void;
};

export function createSeedData(): MoodboardData {
  const boards = structuredClone(seedBoards);
  return {
    boards,
    savedIds: collectSavedIds(boards),
    briefs: [],
    keptKeys: [],
    nudgeDismissed: false,
  };
}

function cleanNote(note: string | undefined): string | undefined {
  if (note === undefined) return undefined;
  const trimmed = note.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function withoutNote(item: BoardItem): BoardItem {
  const next: BoardItem = { postId: item.postId, addedAt: item.addedAt };
  if (item.shortlisted !== undefined) next.shortlisted = item.shortlisted;
  return next;
}

function applyNote(
  item: BoardItem,
  note: string | undefined,
  provided: boolean,
): BoardItem {
  if (!provided) return item;
  const cleaned = cleanNote(note);
  if (!cleaned) return withoutNote(item);
  return { ...item, note: cleaned };
}

function touch(board: Board, now: number): Board {
  return { ...board, updatedAt: now };
}

export const useMoodboardStore = create<MoodboardState>()(
  persist(
    (set) => ({
      ...createSeedData(),
      toggleSaved: (postId) =>
        set((state) => ({
          savedIds: state.savedIds.includes(postId)
            ? state.savedIds.filter((id) => id !== postId)
            : [...state.savedIds, postId],
        })),
      createBoard: (name, kind) => {
        const trimmed = name.trim();
        if (!trimmed) return undefined;
        const now = Date.now();
        const id = `b-${crypto.randomUUID()}`;
        const board: Board = {
          id,
          name: trimmed,
          kind,
          isPrivate: true,
          items: [],
          members: [],
          comments: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ boards: [...state.boards, board] }));
        return id;
      },
      renameBoard: (boardId, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const now = Date.now();
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? touch({ ...board, name: trimmed }, now)
              : board,
          ),
        }));
      },
      setPrivate: (boardId, isPrivate) => {
        const now = Date.now();
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId ? touch({ ...board, isPrivate }, now) : board,
          ),
        }));
      },
      deleteBoard: (boardId) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== boardId),
        })),
      addToBoard: (boardId, postId, note) => {
        const now = Date.now();
        const provided = note !== undefined;
        set((state) => {
          if (!state.boards.some((board) => board.id === boardId)) return state;
          return {
            savedIds: state.savedIds.includes(postId)
              ? state.savedIds
              : [...state.savedIds, postId],
            boards: state.boards.map((board) => {
              if (board.id !== boardId) return board;
              const existing = board.items.find(
                (entry) => entry.postId === postId,
              );
              const items = existing
                ? board.items.map((entry) =>
                    entry.postId === postId
                      ? applyNote(entry, note, provided)
                      : entry,
                  )
                : [
                    ...board.items,
                    applyNote({ postId, addedAt: now }, note, provided),
                  ];
              return touch({ ...board, items }, now);
            }),
          };
        });
      },
      removeFromBoard: (boardId, postId) => {
        const now = Date.now();
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            return touch(
              {
                ...board,
                items: board.items.filter((entry) => entry.postId !== postId),
              },
              now,
            );
          }),
        }));
      },
      moveItem: (fromId, toId, postId) => {
        if (fromId === toId) return;
        const now = Date.now();
        set((state) => {
          const source = state.boards.find((board) => board.id === fromId);
          const moving = source?.items.find((entry) => entry.postId === postId);
          const destination = state.boards.find((board) => board.id === toId);
          if (!source || !moving || !destination) return state;
          return {
            boards: state.boards.map((board) => {
              if (board.id === fromId) {
                return touch(
                  {
                    ...board,
                    items: board.items.filter(
                      (entry) => entry.postId !== postId,
                    ),
                  },
                  now,
                );
              }
              if (board.id !== toId) return board;
              if (board.items.some((entry) => entry.postId === postId)) {
                return board;
              }
              return touch({ ...board, items: [...board.items, moving] }, now);
            }),
          };
        });
      },
      setNote: (boardId, postId, note) => {
        const now = Date.now();
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            return touch(
              {
                ...board,
                items: board.items.map((entry) =>
                  entry.postId === postId
                    ? applyNote(entry, note, true)
                    : entry,
                ),
              },
              now,
            );
          }),
        }));
      },
      toggleShortlist: (boardId, postId) => {
        const now = Date.now();
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            return touch(
              {
                ...board,
                items: board.items.map((entry) =>
                  entry.postId === postId
                    ? { ...entry, shortlisted: !entry.shortlisted }
                    : entry,
                ),
              },
              now,
            );
          }),
        }));
      },
      saveDirection: (direction) =>
        set((state) => {
          const next = { ...direction, savedToBrief: true };
          const exists = state.briefs.some((item) => item.id === direction.id);
          return {
            briefs: exists
              ? state.briefs.map((item) =>
                  item.id === direction.id ? next : item,
                )
              : [...state.briefs, next],
          };
        }),
      removeDirection: (id) =>
        set((state) => ({
          briefs: state.briefs.filter((item) => item.id !== id),
        })),
      addMember: (boardId, handle) => {
        const cleaned = handle.trim().replace(/^@/, "");
        if (!cleaned) return;
        const now = Date.now();
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            const members = board.members ?? [];
            if (
              members.some(
                (entry) => entry.toLowerCase() === cleaned.toLowerCase(),
              )
            ) {
              return board;
            }
            return touch({ ...board, members: [...members, cleaned] }, now);
          }),
        }));
      },
      addComment: (boardId, text) => {
        const cleaned = text.trim();
        if (!cleaned) return;
        const now = Date.now();
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            const comments = board.comments ?? [];
            return touch(
              {
                ...board,
                comments: [
                  ...comments,
                  {
                    id: `c-${crypto.randomUUID()}`,
                    author: "you",
                    text: cleaned,
                    createdAt: now,
                  },
                ],
              },
              now,
            );
          }),
        }));
      },
      keepSave: (key) =>
        set((state) => ({
          keptKeys: state.keptKeys.includes(key)
            ? state.keptKeys
            : [...state.keptKeys, key],
        })),
      dismissNudge: () => set({ nudgeDismissed: true }),
      resetDemo: () => set(createSeedData()),
    }),
    {
      name: MOODBOARD_STORAGE_KEY,
      storage: createSafeLocalStorage<MoodboardData>(),
      partialize: (state) => ({
        boards: state.boards,
        savedIds: state.savedIds,
        briefs: state.briefs,
        keptKeys: state.keptKeys,
        nudgeDismissed: state.nudgeDismissed,
      }),
    },
  ),
);
