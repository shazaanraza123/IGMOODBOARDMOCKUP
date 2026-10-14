import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { Link } from "react-router-dom";
import { PostImage } from "../components/PostImage";
import { Sheet } from "../components/Sheet";
import { getPost } from "../data/posts";
import { useMoodboardStore } from "../store/useMoodboardStore";
import styles from "./PostDetailSheet.module.css";

type PostDetailSheetProps = {
  boardId: string;
  postId: string | null;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function PostDetailSheet({
  boardId,
  postId,
  onClose,
  returnFocusRef,
}: PostDetailSheetProps) {
  const boards = useMoodboardStore((state) => state.boards);
  const setNote = useMoodboardStore((state) => state.setNote);
  const toggleShortlist = useMoodboardStore((state) => state.toggleShortlist);
  const removeFromBoard = useMoodboardStore((state) => state.removeFromBoard);
  const moveItem = useMoodboardStore((state) => state.moveItem);
  const [moving, setMoving] = useState(false);
  const [draft, setDraft] = useState("");

  const board = boards.find((entry) => entry.id === boardId);
  const item = board?.items.find((entry) => entry.postId === postId);
  const post = postId ? getPost(postId) : undefined;

  useEffect(() => {
    setMoving(false);
    if (!postId) {
      setDraft("");
      return;
    }
    const current = useMoodboardStore
      .getState()
      .boards.find((entry) => entry.id === boardId)
      ?.items.find((entry) => entry.postId === postId);
    setDraft(current?.note ?? "");
  }, [postId, boardId]);

  const destinations = boards.filter(
    (entry) =>
      entry.id !== boardId &&
      !entry.items.some((entryItem) => entryItem.postId === postId),
  );

  return (
    <Sheet
      open={post !== undefined && item !== undefined}
      title={moving ? "Move to" : (post?.author ?? "Post")}
      titleId="post-detail-title"
      onClose={onClose}
      returnFocusRef={returnFocusRef}
    >
      {post && item ? (
        moving ? (
          <div className={styles.body}>
            <button
              type="button"
              className={styles.row}
              onClick={() => setMoving(false)}
            >
              Back
            </button>
            {destinations.length === 0 ? (
              <p className={styles.empty}>
                It's already on your other moodboards.
              </p>
            ) : (
              destinations.map((destination) => (
                <button
                  key={destination.id}
                  type="button"
                  className={styles.row}
                  onClick={() => {
                    moveItem(boardId, destination.id, post.id);
                    onClose();
                  }}
                >
                  {destination.name}
                </button>
              ))
            )}
          </div>
        ) : (
          <div className={styles.body}>
            <PostImage
              image={post.image}
              imageAlt={post.imageAlt}
              tint={post.tint}
              width={390}
              height={280}
            />
            <p className={styles.caption}>
              <strong>{post.author}</strong> {post.caption}
            </p>
            <label className={styles.label} htmlFor="detail-note">
              Note
            </label>
            <textarea
              id="detail-note"
              className={styles.note}
              value={draft}
              rows={3}
              placeholder="Why did you save this?"
              onChange={(event) => {
                const next = event.target.value;
                setDraft(next);
                setNote(boardId, post.id, next);
              }}
            />
            <button
              type="button"
              className={styles.row}
              aria-pressed={Boolean(item.shortlisted)}
              onClick={() => toggleShortlist(boardId, post.id)}
            >
              {item.shortlisted ? "Remove from shortlist" : "Shortlist"}
            </button>
            <button
              type="button"
              className={styles.row}
              onClick={() => setMoving(true)}
            >
              Move to…
            </button>
            <button
              type="button"
              className={styles.row}
              onClick={() => {
                removeFromBoard(boardId, post.id);
                onClose();
              }}
            >
              Remove from board
            </button>
            <Link
              className={styles.row}
              to={`/board/${boardId}/similar?post=${post.id}`}
            >
              Find similar to this
            </Link>
          </div>
        )
      ) : null}
    </Sheet>
  );
}
