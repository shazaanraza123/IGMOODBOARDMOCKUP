import type { RefObject } from "react";
import { PostImage } from "../components/PostImage";
import { Sheet } from "../components/Sheet";
import { useMoodboardStore } from "../store/useMoodboardStore";
import type { Post } from "../types";
import styles from "./SimilarResultSheet.module.css";

type SimilarResultSheetProps = {
  boardId: string;
  post: Post | null;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function SimilarResultSheet({
  boardId,
  post,
  onClose,
  returnFocusRef,
}: SimilarResultSheetProps) {
  const item = useMoodboardStore((state) =>
    state.boards
      .find((board) => board.id === boardId)
      ?.items.find((entry) => entry.postId === post?.id),
  );
  const addToBoard = useMoodboardStore((state) => state.addToBoard);
  const toggleShortlist = useMoodboardStore((state) => state.toggleShortlist);
  const saved = Boolean(item);

  return (
    <Sheet
      open={post !== null}
      title={post?.author ?? "Post"}
      titleId="similar-result-title"
      onClose={onClose}
      returnFocusRef={returnFocusRef}
    >
      {post ? (
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
          <button
            type="button"
            className={styles.primary}
            disabled={saved}
            onClick={() => addToBoard(boardId, post.id)}
          >
            {saved ? "Saved" : "Save to this board"}
          </button>
          <button
            type="button"
            className={styles.row}
            aria-pressed={Boolean(item?.shortlisted)}
            onClick={() => {
              if (!saved) addToBoard(boardId, post.id);
              toggleShortlist(boardId, post.id);
            }}
          >
            {item?.shortlisted ? "Remove from shortlist" : "Shortlist"}
          </button>
        </div>
      ) : null}
    </Sheet>
  );
}
