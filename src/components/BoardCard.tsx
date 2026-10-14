import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import { Link } from "react-router-dom";
import { getPost } from "../data/posts";
import type { Board } from "../types";
import { Icon } from "./Icon";
import { PostImage } from "./PostImage";
import styles from "./BoardCard.module.css";

const HOLD_MS = 500;

type BoardCardProps = {
  board: Board;
  onOpenOptions: (boardId: string, anchor: HTMLElement) => void;
};

export function BoardCard({ board, onOpenOptions }: BoardCardProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const optionsRef = useRef<HTMLButtonElement>(null);
  const hold = useRef<number | null>(null);
  const skipClick = useRef(false);
  const covers = board.items
    .map((item) => getPost(item.postId))
    .filter((post) => post !== undefined)
    .slice(0, 3);
  const notes = board.items.filter((item) => item.note).length;

  const clearHold = () => {
    if (hold.current !== null) {
      window.clearTimeout(hold.current);
      hold.current = null;
    }
  };

  useEffect(() => clearHold, []);

  const openFrom = (anchor: HTMLElement | null) => {
    if (!anchor) return;
    onOpenOptions(board.id, anchor);
  };

  const onPointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.button !== 0) return;
    clearHold();
    hold.current = window.setTimeout(() => {
      hold.current = null;
      skipClick.current = true;
      openFrom(linkRef.current);
    }, HOLD_MS);
  };

  return (
    <article className={styles.card}>
      <Link
        ref={linkRef}
        to={`/board/${board.id}`}
        className={styles.open}
        onPointerDown={onPointerDown}
        onPointerUp={clearHold}
        onPointerLeave={clearHold}
        onPointerCancel={clearHold}
        onContextMenu={(event) => event.preventDefault()}
        onClick={(event) => {
          if (!skipClick.current) return;
          event.preventDefault();
          skipClick.current = false;
        }}
      >
        <span className={styles.collage}>
          {[0, 1, 2].map((index) => {
            const cover = covers[index];
            return (
              <span
                key={cover?.id ?? `empty-${index}`}
                className={index === 0 ? styles.big : styles.small}
              >
                {cover ? (
                  <PostImage
                    image={cover.image}
                    imageAlt={cover.imageAlt}
                    tint={cover.tint}
                    width={index === 0 ? 180 : 90}
                    height={index === 0 ? 180 : 90}
                  />
                ) : (
                  <span className={styles.empty} />
                )}
              </span>
            );
          })}
        </span>
        <span className={styles.name}>{board.name}</span>
        <span className={styles.meta}>
          {board.items.length} saved · {notes} notes
        </span>
      </Link>
      <button
        ref={optionsRef}
        type="button"
        className={styles.options}
        aria-label={`Options for ${board.name}`}
        onClick={() => openFrom(optionsRef.current)}
      >
        <Icon name="more" size={18} />
      </button>
    </article>
  );
}
