import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { Link } from "react-router-dom";
import { Sheet } from "../components/Sheet";
import { useToast } from "../components/toastState";
import { useMoodboardStore } from "../store/useMoodboardStore";
import type { Board } from "../types";
import styles from "./BoardMenu.module.css";

type BoardMenuProps = {
  board: Board | null;
  includeShare?: boolean;
  onClose: () => void;
  onDeleted?: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function BoardMenu({
  board,
  includeShare = false,
  onClose,
  onDeleted,
  returnFocusRef,
}: BoardMenuProps) {
  const renameBoard = useMoodboardStore((state) => state.renameBoard);
  const setPrivate = useMoodboardStore((state) => state.setPrivate);
  const deleteBoard = useMoodboardStore((state) => state.deleteBoard);
  const { show } = useToast();
  const [renaming, setRenaming] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    setRenaming(false);
    setConfirming(false);
    setName(board?.name ?? "");
  }, [board]);

  const saveName = () => {
    if (!board) return;
    renameBoard(board.id, name);
    onClose();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
    } catch {
      // Clipboard can be blocked. The toast still confirms the action.
    }
    show({ title: "Link copied" });
    onClose();
  };

  return (
    <Sheet
      open={board !== null}
      title={board?.name ?? "Moodboard"}
      titleId="board-menu-title"
      onClose={onClose}
      returnFocusRef={returnFocusRef}
    >
      {board ? (
        <div className={styles.body}>
          {confirming ? (
            <>
              <p className={styles.confirm}>Delete {board.name}?</p>
              <button
                type="button"
                className={styles.danger}
                onClick={() => {
                  deleteBoard(board.id);
                  onClose();
                  onDeleted?.();
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className={styles.row}
                onClick={() => setConfirming(false)}
              >
                Cancel
              </button>
            </>
          ) : renaming ? (
            <form
              className={styles.rename}
              onSubmit={(event) => {
                event.preventDefault();
                saveName();
              }}
            >
              <label className={styles.label} htmlFor="rename-moodboard">
                Moodboard name
              </label>
              <input
                id="rename-moodboard"
                className={styles.input}
                value={name}
                autoFocus
                onChange={(event) => setName(event.target.value)}
              />
              <button
                type="submit"
                className={styles.primary}
                disabled={name.trim().length === 0}
              >
                Save
              </button>
            </form>
          ) : (
            <>
              <button
                type="button"
                className={styles.row}
                onClick={() => setRenaming(true)}
              >
                Rename
              </button>
              <button
                type="button"
                className={styles.row}
                onClick={() => setPrivate(board.id, !board.isPrivate)}
              >
                {board.isPrivate ? "Make public" : "Make private"}
              </button>
              {includeShare ? (
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => {
                    void copyLink();
                  }}
                >
                  Share link
                </button>
              ) : null}
              {includeShare ? (
                <Link to="/brief" className={styles.row} onClick={onClose}>
                  Brief
                </Link>
              ) : null}
              <button
                type="button"
                className={styles.danger}
                onClick={() => setConfirming(true)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ) : null}
    </Sheet>
  );
}
