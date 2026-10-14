import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Chip } from "../components/Chip";
import { EmptyState } from "../components/EmptyState";
import { Header, IconButton } from "../components/Header";
import { Icon } from "../components/Icon";
import { MasonryGrid } from "../components/MasonryGrid";
import { NoteOverlay } from "../components/NoteOverlay";
import { PostImage } from "../components/PostImage";
import { boardTitle } from "../data/boardIds";
import { getPost } from "../data/posts";
import { suggestGroups } from "../lib/grouping";
import { attributeLabel } from "../lib/labels";
import { useMoodboardStore } from "../store/useMoodboardStore";
import { BoardMenu } from "../sheets/BoardMenu";
import { PostDetailSheet } from "../sheets/PostDetailSheet";
import type { Attribute, BoardItem } from "../types";
import styles from "./Board.module.css";

const TILE_RATIOS = [
  { width: 3, height: 4 },
  { width: 1, height: 1 },
  { width: 4, height: 5 },
];

type Filter = "notes" | "shortlist";

export function Board() {
  const { id } = useParams();
  const boardId = id ?? "";
  const navigate = useNavigate();
  const board = useMoodboardStore((state) =>
    state.boards.find((entry) => entry.id === boardId),
  );
  const [filter, setFilter] = useState<Filter | null>(null);
  const [group, setGroup] = useState<Attribute | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const detailFocus = useRef<HTMLElement | null>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const title = board?.name ?? boardTitle(boardId);
  const subtitle = board
    ? `${board.items.length} saved · ${board.isPrivate ? "Private" : "Public"}`
    : undefined;

  const toggle = (next: Filter) => {
    setFilter((current) => (current === next ? null : next));
  };

  const boardPosts = (board?.items ?? [])
    .map((item) => getPost(item.postId))
    .filter((post) => post !== undefined);
  const groups = board?.kind === "creator" ? suggestGroups(boardPosts) : [];
  const activeGroup = groups.some((entry) => entry.attribute === group)
    ? group
    : null;
  const ideasTo = activeGroup
    ? `/board/${boardId}/ideas?group=${activeGroup}`
    : `/board/${boardId}/ideas`;

  const visible = (board?.items ?? []).filter((item) => {
    if (
      activeGroup &&
      !getPost(item.postId)?.attributes.includes(activeGroup)
    ) {
      return false;
    }
    if (filter === "notes") return Boolean(item.note);
    if (filter === "shortlist") return Boolean(item.shortlisted);
    return true;
  });

  useEffect(() => {
    const node = stickyRef.current;
    if (!node) return;
    const root = document.documentElement;
    const apply = () => {
      root.style.setProperty(
        "--toast-lift",
        `${node.getBoundingClientRect().height + 12}px`,
      );
    };
    apply();
    if (typeof ResizeObserver === "undefined") {
      return () => root.style.removeProperty("--toast-lift");
    }
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--toast-lift");
    };
  }, [board?.id, board?.kind]);

  const noteCount = board?.items.filter((item) => item.note).length ?? 0;
  const shortCount =
    board?.items.filter((item) => item.shortlisted).length ?? 0;

  return (
    <section className={styles.screen} aria-labelledby="board-title">
      <Header
        title={title}
        titleId="board-title"
        subtitle={subtitle}
        backTo="/saved"
        end={
          board ? (
            <IconButton
              ref={moreRef}
              label="More"
              onClick={() => setMenuOpen(true)}
            >
              <Icon name="more" />
            </IconButton>
          ) : null
        }
      />
      {!board ? (
        <EmptyState>
          Nothing here yet. Tap the bookmark on any post to add it.
        </EmptyState>
      ) : (
        <>
          {board.kind === "creator" ? (
            <div className={styles.links}>
              <Chip to={`/board/${boardId}/similar`} tone="blue">
                <Icon name="sparkle" size={16} />
                Find similar
              </Chip>
              <Chip to="/brief">Brief</Chip>
            </div>
          ) : null}
          <div className={styles.chips}>
            {board.kind === "shopping" ? (
              <Chip to={`/board/${boardId}/similar`} tone="blue">
                <Icon name="sparkle" size={16} />
                Find similar
              </Chip>
            ) : null}
            <Chip pressed={filter === "notes"} onClick={() => toggle("notes")}>
              Notes ({noteCount})
            </Chip>
            <Chip
              pressed={filter === "shortlist"}
              onClick={() => toggle("shortlist")}
            >
              Shortlist ({shortCount})
            </Chip>
          </div>
          {groups.length > 0 ? (
            <div className={styles.groups}>
              <p className={styles.groupLabel}>
                <Icon name="sparkle" size={16} />
                Suggested groups
              </p>
              <div className={styles.chips}>
                {groups.map((entry) => (
                  <Chip
                    key={entry.attribute}
                    pressed={activeGroup === entry.attribute}
                    onClick={() =>
                      setGroup((current) =>
                        current === entry.attribute ? null : entry.attribute,
                      )
                    }
                  >
                    {attributeLabel(entry.attribute)} · {entry.count}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}
          {board.items.length === 0 ? (
            <EmptyState>
              Nothing here yet. Tap the bookmark on any post to add it.
            </EmptyState>
          ) : visible.length === 0 ? (
            <EmptyState>
              {filter === "notes"
                ? "No notes on this board yet."
                : filter === "shortlist"
                  ? "Nothing shortlisted yet."
                  : "Nothing in this group."}
            </EmptyState>
          ) : (
            <div
              className={
                board.kind === "creator" ? styles.withAction : undefined
              }
            >
              <MasonryGrid>
                {visible.map((item, index) => (
                  <Tile
                    key={item.postId}
                    item={item}
                    index={index}
                    onOpen={(anchor) => {
                      detailFocus.current = anchor;
                      setDetailId(item.postId);
                    }}
                  />
                ))}
              </MasonryGrid>
            </div>
          )}
          {board.kind === "creator" ? (
            <div ref={stickyRef} className={styles.sticky} data-sticky-cta="">
              <Link className={styles.develop} to={ideasTo}>
                <Icon name="sparkle" size={18} />
                Develop an idea
              </Link>
              <p className={styles.helper}>
                Uses only the posts in this board.
              </p>
            </div>
          ) : null}
        </>
      )}
      <PostDetailSheet
        boardId={boardId}
        postId={detailId}
        onClose={() => setDetailId(null)}
        returnFocusRef={detailFocus}
      />
      <BoardMenu
        board={menuOpen ? (board ?? null) : null}
        includeShare
        onClose={() => setMenuOpen(false)}
        onDeleted={() => navigate("/saved")}
        returnFocusRef={moreRef}
      />
    </section>
  );
}

function Tile({
  item,
  index,
  onOpen,
}: {
  item: BoardItem;
  index: number;
  onOpen: (anchor: HTMLElement) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const post = getPost(item.postId);
  if (!post) return null;
  const ratio = TILE_RATIOS[index % TILE_RATIOS.length] ?? TILE_RATIOS[0];
  if (!ratio) return null;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={styles.tile}
      onClick={() => {
        if (buttonRef.current) onOpen(buttonRef.current);
      }}
    >
      <PostImage
        image={post.image}
        imageAlt={post.imageAlt}
        tint={post.tint}
        width={ratio.width}
        height={ratio.height}
      />
      {item.note ? <NoteOverlay text={item.note} /> : null}
      {item.shortlisted ? (
        <span className={styles.pill}>Shortlisted</span>
      ) : null}
    </button>
  );
}
