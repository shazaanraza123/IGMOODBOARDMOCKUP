import type { PersistStorage, StorageValue } from "zustand/middleware";

export const MOODBOARD_STORAGE_KEY = "moodboard-v1";

export function createSafeLocalStorage<S>(): PersistStorage<S> {
  return {
    getItem: (name) => {
      try {
        const raw = localStorage.getItem(name);
        if (raw === null) return null;
        return JSON.parse(raw) as StorageValue<S>;
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        localStorage.setItem(name, JSON.stringify(value));
      } catch {
        // Storage can be blocked or full. The in-memory store still works.
      }
    },
    removeItem: (name) => {
      try {
        localStorage.removeItem(name);
      } catch {
        // Ignore blocked storage.
      }
    },
  };
}
