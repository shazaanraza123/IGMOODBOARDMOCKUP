import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { Icon } from "../components/Icon";
import { PostImage } from "../components/PostImage";
import { Sheet } from "../components/Sheet";
import { useToast } from "../components/toastState";
import { getPost } from "../data/posts";
import { useMoodboardStore } from "../store/useMoodboardStore";
import type { Post } from "../types";
import styles from "./SaveSheet.module.css";

const NOTE_LIMIT = 140;

type SaveSheetProps = {
  post: Post | null;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function SaveSheet({ post, onClose, returnFocusRef }: SaveSheetProps) {
  const boards = useMoodboardStore((state) => state.boards);
  const addToBoard = useMoodboardStore((state) => state.addToBoard);
  const removeFromBoard = useMoodboardStore((state) => state.removeFromBoard);
  const createBoard = useMoodboardStore((state) => state.createBoard);
  const saveNote = useMoodboardStore((state) => state.setNote);
  const { show } = useToast();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!post) {
      setCreating(false);
      setName("");
      return;
    }
    const existing = useMoodboardStore
      .getState()
      .boards.flatMap((board) => board.items)
      .find((item) => item.postId === post.id && item.note);
    setNote(existing?.note ?? "");
    setCreating(false);
    setName("");
  }, [post]);

  const finish = () => {
    if (!post) return;
    const members = useMoodboardStore
      .getState()
      .boards.filter((board) =>
        board.items.some((item) => item.postId === post.id),
      );
    for (const board of members) saveNote(board.id, post.id, note);
    const saved = useMoodboardStore.getState().savedIds.includes(post.id);
    onClose();
    if (members.length === 1) {
      const boardName = members[0]?.name;
      if (boardName) show({ title: `Saved to ${boardName}` });
    } else if (members.length > 1) {
      show({ title: `Saved to ${members.length} moodboards` });
    } else if (saved) {
      show({ title: "Saved" });
    }
  };

  return (
    <Sheet
      open={post !== null}
      title="Save to moodboard"
      titleId="save-sheet-title"
      onClose={onClose}
      returnFocusRef={returnFocusRef}
    >
      {post ? (
        <>
          <div className={styles.body}>
            <ul className={styles.list}>
              {boards.map((board) => {
                const selected = board.items.some(
                  (item) => item.postId === post.id,
                );
                const coverId = board.items[0]?.postId;
                const cover = coverId ? getPost(coverId) : undefined;
                return (
                  <li key={board.id}>
                    <button
                      type="button"
                      className={styles.row}
                      aria-pressed={selected}
                      onClick={() => {
                        if (selected) removeFromBoard(board.id, post.id);
                        else addToBoard(board.id, post.id);
                      }}
                    >
                      <span className={styles.thumb}>
                        {cover ? (
                          <PostImage
                            image={cover.image}
                            imageAlt={cover.imageAlt}
                            tint={cover.tint}
                            width={48}
                            height={48}
                          />
                        ) : (
                          <span
                            className={styles.emptyThumb}
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <span className={styles.meta}>
                        <span className={styles.name}>{board.name}</span>
                        <span className={styles.detail}>
                          {board.items.length} saved ·{" "}
                          {board.isPrivate ? "Private" : "Public"}
                        </span>
                      </span>
                      <span
                        className={selected ? styles.radioOn : styles.radio}
                        aria-hidden="true"
                      >
                        {selected ? <Icon name="check" size={14} /> : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {creating ? (
              <form
                className={styles.create}
                onSubmit={(event) => {
                  event.preventDefault();
                  const id = createBoard(name, "general");
                  if (!id) return;
                  addToBoard(id, post.id);
                  setName("");
                  setCreating(false);
                }}
              >
                <label className={styles.label} htmlFor="new-moodboard-name">
                  New moodboard
                </label>
                <div className={styles.createRow}>
                  <input
                    id="new-moodboard-name"
                    className={styles.input}
                    value={name}
                    placeholder="Moodboard name"
                    autoFocus
                    onChange={(event) => setName(event.target.value)}
                  />
                  <button
                    type="submit"
                    className={styles.createButton}
                    disabled={name.trim().length === 0}
                  >
                    Create
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                className={styles.newRow}
                onClick={() => setCreating(true)}
              >
                <Icon name="plus" />
                New moodboard
              </button>
            )}

            <div className={styles.noteBlock}>
              <label className={styles.label} htmlFor="save-note">
                Add a note (optional)
              </label>
              <input
                id="save-note"
                className={styles.input}
                value={note}
                maxLength={NOTE_LIMIT}
                placeholder="Why are you saving this?"
                aria-describedby="save-note-count"
                onChange={(event) =>
                  setNote(event.target.value.slice(0, NOTE_LIMIT))
                }
              />
              <p id="save-note-count" className={styles.count}>
                {note.length}/{NOTE_LIMIT}
              </p>
            </div>
          </div>
          <div className={styles.footer}>
            <button type="button" className={styles.done} onClick={finish}>
              Done
            </button>
          </div>
        </>
      ) : null}
    </Sheet>
  );
}
