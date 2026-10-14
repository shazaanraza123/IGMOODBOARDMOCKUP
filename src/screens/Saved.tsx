import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { BoardCard } from "../components/BoardCard";
import { Header, IconButton } from "../components/Header";
import { Icon } from "../components/Icon";
import { PostImage } from "../components/PostImage";
import { getPost, posts } from "../data/posts";
import { searchMoodboard } from "../lib/search";
import { useMoodboardStore } from "../store/useMoodboardStore";
import { BoardMenu } from "../sheets/BoardMenu";
import { NewBoardSheet } from "../sheets/NewBoardSheet";
import styles from "./Saved.module.css";

const TABS = ["posts", "collections", "moodboards"] as const;
type SavedTab = (typeof TABS)[number];

const TAB_LABEL: Record<SavedTab, string> = {
  posts: "All posts",
  collections: "Collections",
  moodboards: "Moodboards",
};

const COLLECTION_IDS = [
  "p-hero",
  "p-boot-shaft",
  "p-boot-square",
  "p-stage-01",
  "p-stage-02",
  "p-rowan",
  "p-fashion-linen",
  "p-pack-sleeve",
  "p-pack-label",
];

export function Saved() {
  const boards = useMoodboardStore((state) => state.boards);
  const savedIds = useMoodboardStore((state) => state.savedIds);
  const [tab, setTab] = useState<SavedTab>("moodboards");
  const [query, setQuery] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const tabRefs = useRef<Record<SavedTab, HTMLButtonElement | null>>({
    posts: null,
    collections: null,
    moodboards: null,
  });
  const menuFocus = useRef<HTMLElement | null>(null);
  const createFocus = useRef<HTMLButtonElement | null>(null);
  const menuBoard = boards.find((board) => board.id === menuId) ?? null;
  const trimmed = query.trim();
  const result = searchMoodboard(trimmed, boards, posts, savedIds);

  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.indexOf(tab);
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next =
      event.key === "ArrowRight"
        ? TABS[(index + 1) % TABS.length]
        : TABS[(index - 1 + TABS.length) % TABS.length];
    if (!next) return;
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className={styles.screen} aria-labelledby="saved-title">
      <Header
        title="Saved"
        titleId="saved-title"
        backTo="/"
        end={
          <>
            <IconButton
              ref={createFocus}
              label="New moodboard"
              onClick={() => setCreating(true)}
            >
              <Icon name="plus" />
            </IconButton>
            <IconButton label="About" to="/about">
              <Icon name="info" />
            </IconButton>
          </>
        }
      />
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Saved"
        onKeyDown={onTabKey}
      >
        {TABS.map((id) => (
          <button
            key={id}
            ref={(node) => {
              tabRefs.current[id] = node;
            }}
            type="button"
            role="tab"
            id={`saved-tab-${id}`}
            className={styles.tab}
            aria-selected={tab === id}
            aria-controls={`saved-panel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            onClick={() => setTab(id)}
          >
            {TAB_LABEL[id]}
          </button>
        ))}
      </div>

      {tab === "posts" ? (
        <div
          role="tabpanel"
          id="saved-panel-posts"
          aria-labelledby="saved-tab-posts"
          className={styles.panel}
        >
          {savedIds.length === 0 ? (
            <p className={styles.empty}>Nothing saved yet.</p>
          ) : (
            <div className={styles.tiles}>
              {savedIds.map((postId) => {
                const post = getPost(postId);
                if (!post) return null;
                const home = boards.find((board) =>
                  board.items.some((item) => item.postId === postId),
                );
                const image = (
                  <PostImage
                    image={post.image}
                    imageAlt={post.imageAlt}
                    tint={post.tint}
                    width={130}
                    height={130}
                  />
                );
                return home ? (
                  <Link
                    key={postId}
                    to={`/board/${home.id}`}
                    className={styles.tile}
                  >
                    {image}
                  </Link>
                ) : (
                  <div key={postId} className={styles.tile}>
                    {image}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {tab === "collections" ? (
        <div
          role="tabpanel"
          id="saved-panel-collections"
          aria-labelledby="saved-tab-collections"
          className={styles.panel}
        >
          <p className={styles.note}>This is how Saved works today.</p>
          <div className={styles.tiles}>
            {COLLECTION_IDS.map((postId) => {
              const post = getPost(postId);
              if (!post) return null;
              return (
                <div key={postId} className={styles.tile}>
                  <PostImage
                    image={post.image}
                    imageAlt={post.imageAlt}
                    tint={post.tint}
                    width={130}
                    height={130}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {tab === "moodboards" ? (
        <div
          role="tabpanel"
          id="saved-panel-moodboards"
          aria-labelledby="saved-tab-moodboards"
          className={styles.panel}
        >
          <div className={styles.searchWrap}>
            <label className={styles.searchLabel} htmlFor="saved-search">
              Search boards, posts and notes
            </label>
            <input
              id="saved-search"
              className={styles.search}
              value={query}
              placeholder="Search boards, posts and notes"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          {result ? (
            result.boardIds.length === 0 && result.posts.length === 0 ? (
              <p className={styles.empty}>
                Nothing matches "{trimmed}". Try a style, like square toe.
              </p>
            ) : (
              <div className={styles.results}>
                {result.boardIds.length > 0 ? (
                  <section>
                    <h2 className={styles.group}>Boards</h2>
                    <div className={styles.grid}>
                      {result.boardIds.map((boardId) => {
                        const board = boards.find(
                          (entry) => entry.id === boardId,
                        );
                        return board ? (
                          <BoardCard
                            key={board.id}
                            board={board}
                            onOpenOptions={(id, anchor) => {
                              menuFocus.current = anchor;
                              setMenuId(id);
                            }}
                          />
                        ) : null;
                      })}
                    </div>
                  </section>
                ) : null}
                {result.posts.length > 0 ? (
                  <section>
                    <h2 className={styles.group}>Posts</h2>
                    <ul className={styles.postList}>
                      {result.posts.map((hit) => {
                        const post = getPost(hit.postId);
                        const board = boards.find(
                          (entry) => entry.id === hit.boardId,
                        );
                        if (!post) return null;
                        const body = (
                          <>
                            <span className={styles.thumb}>
                              <PostImage
                                image={post.image}
                                imageAlt={post.imageAlt}
                                tint={post.tint}
                                width={48}
                                height={48}
                              />
                            </span>
                            <span className={styles.postCopy}>
                              <span className={styles.postHandle}>
                                {post.author}
                              </span>
                              <span className={styles.postText}>
                                {hit.note ?? post.caption}
                              </span>
                              {board ? (
                                <span className={styles.postBoard}>
                                  {board.name}
                                </span>
                              ) : null}
                            </span>
                          </>
                        );
                        return (
                          <li key={`${hit.boardId ?? "saved"}-${hit.postId}`}>
                            {hit.boardId ? (
                              <Link
                                to={`/board/${hit.boardId}`}
                                className={styles.postRow}
                              >
                                {body}
                              </Link>
                            ) : (
                              <div className={styles.postRow}>{body}</div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ) : null}
              </div>
            )
          ) : boards.length === 0 ? (
            <p className={styles.empty}>No moodboards yet.</p>
          ) : (
            <div className={styles.grid}>
              {boards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onOpenOptions={(id, anchor) => {
                    menuFocus.current = anchor;
                    setMenuId(id);
                  }}
                />
              ))}
            </div>
          )}
          <p className={styles.briefRow}>
            <Link to="/brief" className={styles.brief}>
              Brief
            </Link>
          </p>
        </div>
      ) : null}

      <BoardMenu
        board={menuBoard}
        onClose={() => setMenuId(null)}
        returnFocusRef={menuFocus}
      />
      <NewBoardSheet
        open={creating}
        onClose={() => setCreating(false)}
        returnFocusRef={createFocus}
      />
    </section>
  );
}
