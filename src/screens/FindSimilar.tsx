import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Chip } from "../components/Chip";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
import { PostImage } from "../components/PostImage";
import { categoryLabel, getPost, posts } from "../data/posts";
import { attributeLabel } from "../lib/labels";
import { findSimilar, resultLabel } from "../lib/similarity";
import { useMoodboardStore } from "../store/useMoodboardStore";
import { SimilarResultSheet } from "../sheets/SimilarResultSheet";
import type { Attribute, FocusBox, Post } from "../types";
import styles from "./FindSimilar.module.css";

const TABS = [
  { id: "all", label: "All" },
  { id: "products", label: "Similar products" },
  { id: "inspiration", label: "Inspiration" },
] as const;

type ResultTab = (typeof TABS)[number]["id"];

const CENTERED_FOCUS: FocusBox = { x: 25, y: 25, w: 50, h: 50 };

function sourcePost(
  items: { postId: string }[],
  requestedId: string | null,
): Post | undefined {
  if (requestedId && items.some((item) => item.postId === requestedId)) {
    const requested = getPost(requestedId);
    if (requested) return requested;
  }
  if (items.some((item) => item.postId === "p-hero")) return getPost("p-hero");
  const first = items[0];
  return first ? getPost(first.postId) : undefined;
}

export function FindSimilar() {
  const { id } = useParams();
  const boardId = id ?? "";
  const [params] = useSearchParams();
  const board = useMoodboardStore((state) =>
    state.boards.find((entry) => entry.id === boardId),
  );
  const source = sourcePost(board?.items ?? [], params.get("post"));
  const [picked, setPicked] = useState<{
    sourceId: string;
    selected: Attribute[];
  } | null>(null);
  const [tab, setTab] = useState<ResultTab>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const focusRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Record<ResultTab, HTMLButtonElement | null>>({
    all: null,
    products: null,
    inspiration: null,
  });

  const selected =
    source && picked?.sourceId === source.id
      ? picked.selected
      : (source?.attributes.slice(0, 2) ?? []);

  const toggle = (attribute: Attribute) => {
    if (!source) return;
    const next = selected.includes(attribute)
      ? selected.filter((item) => item !== attribute)
      : [...selected, attribute];
    setPicked({ sourceId: source.id, selected: next });
  };

  const results =
    source && selected.length > 0
      ? findSimilar({
          source,
          posts,
          selected,
          excludeIds: board?.items.map((item) => item.postId) ?? [],
        })
      : [];

  const visible = results.filter((result) => {
    if (tab === "products") return result.kind !== "inspiration";
    if (tab === "inspiration") return result.kind === "inspiration";
    return true;
  });

  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((item) => item.id === tab);
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = TABS.length - 1;
    else return;
    event.preventDefault();
    const next = TABS[nextIndex];
    if (!next || next.id === tab) return;
    setTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const focus = source?.focus ?? CENTERED_FOCUS;
  const openPost = openId ? getPost(openId) : undefined;

  return (
    <section className={styles.screen} aria-labelledby="similar-title">
      <Header
        title="Find similar"
        titleId="similar-title"
        backTo={`/board/${boardId}`}
      />
      {!source ? (
        <EmptyState>
          Nothing here yet. Tap the bookmark on any post to add it.
        </EmptyState>
      ) : (
        <>
          <div className={styles.stage}>
            <PostImage
              image={source.image}
              imageAlt={source.imageAlt}
              tint={source.tint}
              width={390}
              height={180}
            />
            <div
              className={styles.focus}
              style={{
                left: `${focus.x}%`,
                top: `${focus.y}%`,
                width: `${focus.w}%`,
                height: `${focus.h}%`,
              }}
            >
              <span className={styles.category}>
                {categoryLabel(source.category)}
              </span>
            </div>
          </div>
          <h2 className={styles.question}>What caught your eye?</h2>
          <div className={styles.chips}>
            {source.attributes.map((attribute) => (
              <Chip
                key={attribute}
                pressed={selected.includes(attribute)}
                onClick={() => toggle(attribute)}
              >
                {attributeLabel(attribute)}
              </Chip>
            ))}
          </div>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Results"
            onKeyDown={onTabKey}
          >
            {TABS.map((item) => (
              <button
                key={item.id}
                ref={(node) => {
                  tabRefs.current[item.id] = node;
                }}
                type="button"
                role="tab"
                id={`similar-tab-${item.id}`}
                className={styles.tab}
                aria-selected={tab === item.id}
                aria-controls="similar-panel"
                tabIndex={tab === item.id ? 0 : -1}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div
            id="similar-panel"
            role="tabpanel"
            aria-labelledby={`similar-tab-${tab}`}
            tabIndex={selected.length > 0 && visible.length > 0 ? undefined : 0}
          >
            {selected.length === 0 ? (
              <EmptyState>Pick at least one thing you like.</EmptyState>
            ) : results.length === 0 ? (
              <EmptyState>No close matches yet. Try fewer details.</EmptyState>
            ) : visible.length === 0 ? (
              <EmptyState>Nothing in this tab.</EmptyState>
            ) : (
              <ul className={styles.grid}>
                {visible.map((result) => {
                  const post = getPost(result.postId);
                  if (!post) return null;
                  const byline = post.productTag
                    ? "via tagged post"
                    : post.author;
                  return (
                    <li key={result.postId}>
                      <button
                        type="button"
                        className={styles.card}
                        onClick={(event) => {
                          focusRef.current = event.currentTarget;
                          setOpenId(post.id);
                        }}
                      >
                        <PostImage
                          image={post.image}
                          imageAlt={post.imageAlt}
                          tint={post.tint}
                          width={130}
                          height={130}
                        />
                        <span
                          className={
                            result.kind === "exact-product"
                              ? styles.exact
                              : styles.kind
                          }
                        >
                          {resultLabel(result.kind)}
                        </span>
                        <span className={styles.byline}>{byline}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <p className={styles.info}>
            <Icon name="info" size={16} />
            <span>"Exact match" only shows when a product is tagged.</span>
          </p>
        </>
      )}
      <SimilarResultSheet
        boardId={boardId}
        post={openPost ?? null}
        onClose={() => setOpenId(null)}
        returnFocusRef={focusRef}
      />
    </section>
  );
}
