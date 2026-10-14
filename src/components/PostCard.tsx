import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Icon } from "./Icon";
import { PostImage } from "./PostImage";
import { useToast } from "./toastState";
import { categoryLabel } from "../data/posts";
import { useMoodboardStore } from "../store/useMoodboardStore";
import type { Post } from "../types";
import styles from "./PostCard.module.css";

const HOLD_MS = 500;

type PostCardProps = {
  post: Post;
  onOpenSave: (bookmark: HTMLElement) => void;
};

export function PostCard({ post, onOpenSave }: PostCardProps) {
  const saved = useMoodboardStore((state) => state.savedIds.includes(post.id));
  const toggleSaved = useMoodboardStore((state) => state.toggleSaved);
  const { show, dismiss } = useToast();
  const bookmarkRef = useRef<HTMLButtonElement>(null);
  const hold = useRef<number | null>(null);
  const skipClick = useRef(false);
  const [pop, setPop] = useState(0);

  const clearHold = () => {
    if (hold.current !== null) {
      window.clearTimeout(hold.current);
      hold.current = null;
    }
  };

  useEffect(() => clearHold, []);

  const openSave = () => {
    const bookmark = bookmarkRef.current;
    if (!bookmark) return;
    dismiss();
    onOpenSave(bookmark);
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    clearHold();
    hold.current = window.setTimeout(() => {
      hold.current = null;
      skipClick.current = true;
      openSave();
    }, HOLD_MS);
  };

  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <span
          className={styles.avatar}
          style={{ background: post.tint }}
          aria-hidden="true"
        />
        <div className={styles.who}>
          <p className={styles.handle}>{post.author}</p>
          <p className={styles.subtitle}>{categoryLabel(post.category)}</p>
        </div>
        <button type="button" className={styles.iconButton} aria-label="More">
          <Icon name="more" />
        </button>
      </header>
      <PostImage
        image={post.image}
        imageAlt={post.imageAlt}
        tint={post.tint}
        width={390}
        height={390}
      />
      <div className={styles.actions}>
        <button type="button" className={styles.iconButton} aria-label="Like">
          <Icon name="heart" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Comment"
        >
          <Icon name="comment" />
        </button>
        <button type="button" className={styles.iconButton} aria-label="Share">
          <Icon name="share" />
        </button>
        <span className={styles.spacer} />
        <button
          ref={bookmarkRef}
          type="button"
          className={styles.iconButton}
          aria-label="Save"
          aria-pressed={saved}
          onPointerDown={onPointerDown}
          onPointerUp={clearHold}
          onPointerLeave={clearHold}
          onPointerCancel={clearHold}
          onContextMenu={(event) => event.preventDefault()}
          onClick={() => {
            if (skipClick.current) {
              skipClick.current = false;
              return;
            }
            const willSave = !saved;
            toggleSaved(post.id);
            setPop((count) => count + 1);
            if (!willSave) return;
            show({
              title: "Saved",
              body: "Add it to a moodboard?",
              image: {
                src: post.image,
                alt: post.imageAlt,
                tint: post.tint,
              },
              action: {
                label: "Choose",
                onClick: openSave,
              },
            });
          }}
        >
          <span key={pop} className={pop > 0 ? styles.pop : styles.mark}>
            <Icon name={saved ? "bookmarkFilled" : "bookmark"} />
          </span>
        </button>
      </div>
      <p className={styles.likes}>{post.likes.toLocaleString("en-US")} likes</p>
      <p className={styles.caption}>
        <strong>{post.author}</strong> {post.caption}
      </p>
      <p className={styles.comments}>View all {post.comments} comments</p>
    </article>
  );
}
