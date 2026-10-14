import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { Sheet } from "../components/Sheet";
import { useMoodboardStore } from "../store/useMoodboardStore";
import styles from "./BoardMenu.module.css";

type NewBoardSheetProps = {
  open: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function NewBoardSheet({
  open,
  onClose,
  returnFocusRef,
}: NewBoardSheetProps) {
  const createBoard = useMoodboardStore((state) => state.createBoard);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) setName("");
  }, [open]);

  return (
    <Sheet
      open={open}
      title="New moodboard"
      titleId="new-board-title"
      onClose={onClose}
      returnFocusRef={returnFocusRef}
    >
      <form
        className={styles.rename}
        onSubmit={(event) => {
          event.preventDefault();
          const id = createBoard(name, "general");
          if (!id) return;
          onClose();
        }}
      >
        <label className={styles.label} htmlFor="create-moodboard-name">
          Moodboard name
        </label>
        <input
          id="create-moodboard-name"
          className={styles.input}
          value={name}
          placeholder="Moodboard name"
          autoFocus
          onChange={(event) => setName(event.target.value)}
        />
        <button
          type="submit"
          className={styles.primary}
          disabled={name.trim().length === 0}
        >
          Create
        </button>
      </form>
    </Sheet>
  );
}
