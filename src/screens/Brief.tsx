import { EmptyState } from "../components/EmptyState";
import { getPost } from "../data/posts";
import { Header } from "../components/Header";
import { useToast } from "../components/toastState";
import { directionPlainText, formatLine } from "../lib/ideas";
import { useMoodboardStore } from "../store/useMoodboardStore";
import type { IdeaDirection } from "../types";
import styles from "./Brief.module.css";

const EMPTY =
  "Save a direction and it shows up here, from Develop an idea on any creator board.";

export function BriefList() {
  const briefs = useMoodboardStore((state) => state.briefs);
  const removeDirection = useMoodboardStore((state) => state.removeDirection);
  const { show } = useToast();

  const copy = async (title: string, text: string) => {
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      // Clipboard can be blocked. The toast still confirms the action.
    }
    show({ title });
  };

  if (briefs.length === 0) {
    return <EmptyState>{EMPTY}</EmptyState>;
  }

  return (
    <ul className={styles.list}>
      {briefs.map((direction) => (
        <DraftCard
          key={direction.id}
          direction={direction}
          onCopy={(text) => {
            void copy("Copied", text);
          }}
          onRemove={() => removeDirection(direction.id)}
        />
      ))}
    </ul>
  );
}

function DraftCard({
  direction,
  onCopy,
  onRemove,
}: {
  direction: IdeaDirection;
  onCopy: (text: string) => void;
  onRemove: () => void;
}) {
  const authors = direction.sourcePostIds
    .map((id) => getPost(id)?.author)
    .filter((author): author is string => Boolean(author));
  const credited =
    authors.length > 0
      ? authors.map((author) => `@${author}`).join(" ")
      : "No credited sources";

  return (
    <li className={styles.card}>
      <p className={styles.kicker}>Draft</p>
      <h2 className={styles.title}>{direction.title}</h2>
      <p className={styles.meta}>
        {formatLine(direction.format, direction.structure.length)}
      </p>
      <p className={styles.sources}>{credited}</p>
      <ol className={direction.format === "reel" ? styles.reel : styles.slides}>
        {direction.structure.map((line, index) => (
          <li key={`${index}-${line}`} className={styles.slide}>
            <span className={styles.slideIndex}>
              {direction.format === "reel" ? `Beat ${index + 1}` : index + 1}
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ol>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          onClick={() => onCopy(directionPlainText(direction, authors))}
        >
          Copy as text
        </button>
        <button type="button" className={styles.secondary} onClick={onRemove}>
          Remove
        </button>
      </div>
    </li>
  );
}

export function Brief() {
  return (
    <section className={styles.screen} aria-labelledby="brief-title">
      <Header title="Brief" titleId="brief-title" backTo="/saved" />
      <BriefList />
    </section>
  );
}
