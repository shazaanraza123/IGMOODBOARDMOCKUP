import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Chip } from "../components/Chip";
import { DirectionCard } from "../components/DirectionCard";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
import { PostImage } from "../components/PostImage";
import { Sheet } from "../components/Sheet";
import { getPost } from "../data/posts";
import { suggestGroups } from "../lib/grouping";
import { attributeLabel } from "../lib/labels";
import { generateIdeas } from "../lib/ideas";
import type { IdeaFormat } from "../lib/ideas";
import { useMoodboardStore } from "../store/useMoodboardStore";
import type { Attribute, IdeaDirection, Post } from "../types";
import styles from "./Ideas.module.css";

const FORMATS: { id: IdeaFormat; label: string }[] = [
  { id: "carousel", label: "Carousel" },
  { id: "reel", label: "Reel" },
  { id: "campaign", label: "Campaign" },
];

type PoolPost = { post: Post; addedAt: number };

function poolFor(
  items: { postId: string; addedAt: number }[],
  group: Attribute | null,
): PoolPost[] {
  return items
    .map((item) => {
      const post = getPost(item.postId);
      return post ? { post, addedAt: item.addedAt } : null;
    })
    .filter((entry): entry is PoolPost => entry !== null)
    .filter((entry) => (group ? entry.post.attributes.includes(group) : true))
    .sort((a, b) => b.addedAt - a.addedAt);
}

export function Ideas() {
  const { id } = useParams();
  const boardId = id ?? "";
  const [params] = useSearchParams();
  const board = useMoodboardStore((state) =>
    state.boards.find((entry) => entry.id === boardId),
  );
  const briefs = useMoodboardStore((state) => state.briefs);
  const saveDirection = useMoodboardStore((state) => state.saveDirection);
  const posts = (board?.items ?? [])
    .map((item) => getPost(item.postId))
    .filter((post): post is Post => Boolean(post));
  const requested = params.get("group");
  const group =
    suggestGroups(posts).find((entry) => entry.attribute === requested)
      ?.attribute ?? null;
  const pool = poolFor(board?.items ?? [], group);
  const poolKey = `${group ?? "all"}:${pool.map((entry) => entry.post.id).join(",")}`;
  const defaultIds = pool.slice(0, 5).map((entry) => entry.post.id);
  const [picked, setPicked] = useState<{ key: string; ids: string[] } | null>(
    null,
  );
  const includedIds = picked?.key === poolKey ? picked.ids : defaultIds;
  const [format, setFormat] = useState<IdeaFormat>("carousel");
  const [directions, setDirections] = useState<IdeaDirection[] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const pickerFocus = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const resetDirections = () => {
    clearTimer();
    setGenerating(false);
    setDirections(null);
    setEditingId(null);
  };

  const included = pool.filter((entry) => includedIds.includes(entry.post.id));
  const thumbs = included.slice(0, 5);

  const chooseFormat = (next: IdeaFormat) => {
    setFormat(next);
    resetDirections();
  };

  const toggleReference = (postId: string) => {
    const next = includedIds.includes(postId)
      ? includedIds.filter((item) => item !== postId)
      : [...includedIds, postId];
    setPicked({ key: poolKey, ids: next });
    resetDirections();
  };

  const generate = () => {
    if (included.length === 0 || generating) return;
    clearTimer();
    setGenerating(true);
    setDirections(null);
    setEditingId(null);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setDirections(
        generateIdeas({
          posts: included.map((entry) => entry.post),
          format,
        }),
      );
      setExpanded(0);
      setGenerating(false);
    }, 900);
  };

  const commitEdit = (
    direction: IdeaDirection,
    next: { title: string; structure: string[] },
  ) => {
    const updated = { ...direction, ...next };
    setDirections(
      (current) =>
        current?.map((item) => (item.id === direction.id ? updated : item)) ??
        null,
    );
    setEditingId(null);
    if (briefs.some((item) => item.id === direction.id)) {
      saveDirection(updated);
    }
  };

  return (
    <section className={styles.screen} aria-labelledby="ideas-title">
      <Header
        title="Develop an idea"
        titleId="ideas-title"
        backTo={`/board/${boardId}`}
      />
      {!board || pool.length === 0 ? (
        <p className={styles.empty}>
          Nothing here yet. Tap the bookmark on any post to add it.
        </p>
      ) : (
        <div className={styles.body}>
          <div className={styles.formats}>
            {FORMATS.map((item) => (
              <Chip
                key={item.id}
                pressed={format === item.id}
                onClick={() => chooseFormat(item.id)}
              >
                {item.label}
              </Chip>
            ))}
          </div>
          {group ? (
            <p className={styles.from}>From {attributeLabel(group)}</p>
          ) : null}
          <button
            ref={pickerFocus}
            type="button"
            className={styles.refs}
            aria-label={`Based on ${included.length} references`}
            onClick={() => setPicking(true)}
          >
            <span>Based on {included.length} references</span>
            <span className={styles.thumbs}>
              {thumbs.map((entry) => (
                <span key={entry.post.id} className={styles.thumb}>
                  <PostImage
                    image={entry.post.image}
                    imageAlt={entry.post.imageAlt}
                    tint={entry.post.tint}
                    width={48}
                    height={48}
                  />
                </span>
              ))}
            </span>
          </button>
          <button
            type="button"
            className={styles.generate}
            disabled={generating || included.length === 0}
            onClick={generate}
          >
            <Icon name="sparkle" size={18} />
            Generate 3 directions
          </button>
          {included.length === 0 ? (
            <p className={styles.empty}>Pick at least one reference.</p>
          ) : null}
          {generating ? (
            <div aria-busy="true">
              <p className={styles.status} role="status">
                Generating 3 directions
              </p>
              <div className={styles.skeletons} aria-hidden="true">
                <span className={styles.skeleton} />
                <span className={styles.skeleton} />
                <span className={styles.skeleton} />
              </div>
            </div>
          ) : null}
          {directions ? (
            <ol className={styles.list}>
              {directions.map((direction, index) => (
                <DirectionCard
                  key={direction.id}
                  direction={direction}
                  index={index}
                  expanded={expanded === index}
                  editing={editingId === direction.id}
                  saved={briefs.some((item) => item.id === direction.id)}
                  onToggle={() =>
                    setExpanded((current) => (current === index ? -1 : index))
                  }
                  onEdit={() => setEditingId(direction.id)}
                  onDone={(next) => commitEdit(direction, next)}
                  onSave={() => saveDirection(direction)}
                />
              ))}
            </ol>
          ) : null}
          <p className={styles.footer}>
            Check facts and credit original creators before you post.
          </p>
        </div>
      )}
      <Sheet
        open={picking}
        title="References"
        titleId="references-title"
        onClose={() => setPicking(false)}
        returnFocusRef={pickerFocus}
      >
        <ul className={styles.picker}>
          {pool.map((entry) => {
            const on = includedIds.includes(entry.post.id);
            return (
              <li key={entry.post.id}>
                <button
                  type="button"
                  className={styles.pick}
                  aria-pressed={on}
                  onClick={() => toggleReference(entry.post.id)}
                >
                  <span className={styles.thumb}>
                    <PostImage
                      image={entry.post.image}
                      imageAlt={entry.post.imageAlt}
                      tint={entry.post.tint}
                      width={48}
                      height={48}
                    />
                  </span>
                  <span>{entry.post.author}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Sheet>
    </section>
  );
}
